import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { CreateTaskNoteDto, TaskDto, TaskNoteDto } from '../../models/task';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from '../../models/login-user-dto';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  notes$: Observable<TaskNoteDto[]> = of([]);
  users$: Observable<UserDto[]> = of([]);
  
  taskForm!: FormGroup;
  task: any;
  isEditing: boolean = false;
  showAddNoteInput: boolean = false; 
  newNote: string = ''; 
  showLogs: boolean = false;
  userId: string | null = "";
  selectedUserId: number = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.task = navigation?.extras?.state?.['task'];
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    this.taskForm = this.fb.group({
      title: [this.task?.title || ''],
      description: [this.task?.description || ''],
      assignedToUserId: [this.task?.assignedToUserId || ''] 
    });
    this.fetchNotes(this.task?.id);
    this.fetchUsers();

    this.taskForm.get('assignedToUserId')?.valueChanges.subscribe(userId => {
      this.reassignTask(userId);
    });
  }

  fetchNotes(taskId: number): void {
    this.notes$ = this.userService.getNotesByTask(taskId)
  }

  fetchUsers(): void {
    this.users$ = this.userService.getUsers();
  }

  reassignTask(userId: string): void {
    this.userService.assignTask(this.task.id, userId).subscribe(
      () => {
        this.toastr.success('Task reassigned successfully', 'Success');
      },
      (error) => {
        this.toastr.error('Error reassigning task', 'Error');
      }
    );
  }

  onEdit(): void {
    this.isEditing = true;
  }

  onSave(): void {
    if (!this.isEditing) return;
    const updatedTask: TaskDto = {
      id: this.task.id,
      title: this.taskForm.get('title')?.value,
      description: this.taskForm.get('description')?.value,
      assignedToUserId: this.task.assignedToUserId,
      assignedToUserName: this.task.assignedToUserName,
      createdAt: this.task.createdAt,
      isClosed: this.task.isClosed,
      creatorUserId: Number(this.userId)
    };

    this.userService.updateTask(updatedTask).subscribe(
      (updatedTask) => {
        this.task = updatedTask;
        this.isEditing = false;
        this.toastr.success('Task updated successfully', 'Success');
      },
      (error) => {
        this.toastr.error('Error updating task', 'Error');
      }
    );
  }

  onCancel(): void {
    this.isEditing = false;
    this.router.navigate(['/']);
  }

  addNote(): void {
    if (this.newNote.trim() === '') return;

    const newNoteDto: CreateTaskNoteDto = {
      userId: 3,
      taskItemId: this.task.id,
      note: this.newNote.trim()
    };

    this.userService.addNote(newNoteDto).subscribe(
      (note) => {
        this.notes$ = this.userService.getNotesByTask(this.task.id);
        this.newNote = '';
        this.showAddNoteInput = false;
      },
      (error) => {
        console.error('Error adding note:', error);
      }
    );
  }

  toggleAddNote(): void {
    this.showAddNoteInput = !this.showAddNoteInput;
  }
}
