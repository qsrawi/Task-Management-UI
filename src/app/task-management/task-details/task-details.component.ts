import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { CreateTaskNoteDto, TaskDto, TaskNoteDto } from '../../models/task';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from '../../models/login-user-dto';
import { AdminService } from '../../services/admin.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskLogsComponent } from '../task-logs/task-logs.component';
import { TaskConfig } from '../../models/task-config';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  @ViewChild(TaskLogsComponent) taskLogsComponent!: TaskLogsComponent;

  notes$: Observable<TaskNoteDto[]> = of([]);
  users$: Observable<UserDto[]> = of([]);
  
  taskForm!: FormGroup;
  task: any;
  isEditing: boolean = false;
  showAddNoteInput: boolean = false; 
  newNote: string = ''; 
  showLogs: boolean = false;
  userId: string | null = "";
  userRole: string | null = "";
  selectedUserId: number = 0;
  isEditable: boolean = true;
  quillConfig = TaskConfig.quillConfig;
  projectOptions = TaskConfig.projectOptions;
  companyOptions = TaskConfig.companyOptions;
  personalOptions = TaskConfig.personalOptions;
  

  relatedNameOptions: string[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private adminService: AdminService,
    private dialog: MatDialog
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.task = navigation?.extras?.state?.['task'];
  }

  ngOnInit(): void {
    console.log("task", this.task)
    this.userId = localStorage.getItem('userId');
    this.userRole = localStorage.getItem('userRole');
    const isAllTasks = localStorage.getItem('isAllTasks');
  
    if(this.userRole === "Admin" || isAllTasks === "true" || this.task?.isClosed == true)
      this.isEditable = false;
  
    const formattedStartDate = this.formatDate(this.task?.startDate);
    const formattedDeadLine = this.formatDate(this.task?.deadLine);

    this.taskForm = this.fb.group({
      title: [{ value: this.task?.title || '', disabled: !this.isEditing }],
      description: [{ value: this.task?.description || '', disabled: !this.isEditing }],
      assignedToUserId: [this.task?.assignedToUserId || ''],
      relatedTo: [{ value: this.task?.relatedTo || '', disabled: !this.isEditing }],
      relatedName: [{ value: this.task?.relatedName || '', disabled: !this.isEditing }],
      startDate: [{ value: formattedStartDate || '', disabled: !this.isEditing }],
      deadLine: [{ value: formattedDeadLine || '', disabled: !this.isEditing }],
      newNote: ['']
    });

  
    this.fetchNotes(this.task?.id);
  
    if(this.userRole === "User"){
      this.fetchUsers();
  
      this.taskForm.get('assignedToUserId')?.valueChanges.subscribe(userId => {
        if (userId && !this.taskForm.get('assignedToUserId')?.disabled) {
          this.reassignTask(userId);
          this.taskForm.get('assignedToUserId')?.disable();
        }
      });
    }
  
    const relatedTo = this.taskForm.get('relatedTo')?.value;
    if (relatedTo) {
      this.updateRelatedNameOptions(relatedTo);
    }
  }

  fetchNotes(taskId: number): void {
    this.notes$ = this.userRole === "User" ? this.userService.getNotesByTask(taskId) : this.adminService.getNotesByTask(taskId);
  }

  fetchUsers(): void {
    this.users$ = this.userService.getUsers();
  }

  reassignTask(userId: string): void {
    this.userService.assignTask(this.task.id, userId).subscribe(
      () => {
        this.router.navigate([`/${this.userRole?.toLocaleLowerCase()}/task-list`, this.userId]);
        this.toastr.success('Task reassigned successfully', 'Success');
      },
      () => {
        this.toastr.error('Error reassigning task', 'Error');
      }
    );
  }

  onEdit(): void {
    this.isEditing = true;
    this.taskForm.get('relatedTo')?.enable();
    this.taskForm.get('relatedName')?.enable();
    this.taskForm.get('startDate')?.enable();
    this.taskForm.get('deadLine')?.enable();
    this.taskForm.get('description')?.enable();
    this.taskForm.get('title')?.enable();
  }

  onSave(): void {
    if (!this.isEditing) return;
    
    const updatedTask: TaskDto = {
      id: this.task.id,
      title: this.taskForm.get('title')?.value,
      description: this.taskForm.get('description')?.value,
      assignedToUserId: this.taskForm.get('assignedToUserId')?.value,
      assignedToUserName: this.task.assignedToUserName,
      createdAt: this.task.createdAt,
      isClosed: this.task.isClosed,
      createdBy: this.task.createdBy,
      creatorUserId: Number(this.userId),
      relatedTo: this.taskForm.get('relatedTo')?.value,
      relatedName: this.taskForm.get('relatedName')?.value,
      startDate: this.taskForm.get('startDate')?.value,
      deadLine: this.taskForm.get('deadLine')?.value
    };

    this.userService.updateTask(updatedTask).subscribe(
      (updatedTask) => {
        this.task = updatedTask;
        this.isEditing = false;
        this.toastr.success('Task updated successfully', 'Success');
        this.taskForm.get('relatedTo')?.disable();
        this.taskForm.get('relatedName')?.disable();
        this.taskForm.get('startDate')?.disable();
        this.taskForm.get('deadLine')?.disable();
        this.taskForm.get('description')?.disable(); 
      },
      () => {
        this.toastr.error('Error updating task', 'Error');
      }
    );
  }

  onCancel(): void {
    localStorage.setItem("isAllTasks", "false");
    this.isEditing = false;
    this.router.navigate([`/${this.userRole?.toLocaleLowerCase()}/task-list`, this.userId]);
  }

  addNote(): void {
    const newNoteText = this.taskForm.get('newNote')?.value;
  
    if (newNoteText.trim() === '') return;
  
    const newNoteDto: CreateTaskNoteDto = {
      userId: Number(this.userId),
      taskItemId: this.task.id,
      note: newNoteText.trim()
    };
  
    if (this.userRole === "User")
      this.userService.addNote(newNoteDto).subscribe(
        () => {
          this.notes$ = this.userService.getNotesByTask(this.task.id);
          this.taskForm.get('newNote')?.setValue('');
          this.showAddNoteInput = false;
          this.toastr.success('Note added successfully', 'Success');
        },
        () => {
          this.toastr.error('Error adding note', 'Error');
        }
      );

    else
      this.adminService.addNote(newNoteDto).subscribe(
        () => {
          this.notes$ = this.adminService.getNotesByTask(this.task.id);
          this.taskForm.get('newNote')?.setValue('');
          this.showAddNoteInput = false;
          this.toastr.success('Note added successfully', 'Success');
        },
        () => {
          this.toastr.error('Error adding note', 'Error');
        }
      );
  }

  onDeleteTask(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this task?' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.deleteTask(this.task.id).subscribe(() => {
          this.toastr.success('Task deleted successfully', 'Success');
          this.router.navigate([`/${this.userRole?.toLocaleLowerCase()}/task-list`, this.userId]);
        });
      } else {
        this.toastr.error('Task deletion was canceled', 'Error');
      }
    });
  }

  toggleAddNote(): void {
    this.showAddNoteInput = !this.showAddNoteInput;
  }

  refreshLogs(): void {
    this.taskLogsComponent.fetchLogs(this.task.id);
  }

  onRelatedToChange(event: Event): void {
    const relatedTo = (event.target as HTMLSelectElement).value;
    this.updateRelatedNameOptions(relatedTo);
  
    this.taskForm.get('relatedName')?.setValue('');
  }
  
  updateRelatedNameOptions(relatedTo: string): void {
    switch (relatedTo) {
      case 'Project':
        this.relatedNameOptions = this.projectOptions;
        break;
      case 'Company':
        this.relatedNameOptions = this.companyOptions;
        break;
      case 'Personal':
        this.relatedNameOptions = this.personalOptions;
        break;
      default:
        this.relatedNameOptions = [];
    }
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }
}
