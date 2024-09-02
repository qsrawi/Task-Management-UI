import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, of, take } from 'rxjs';
import { CreateTaskNoteDto, TaskDto, TaskNoteDto } from '../../models/task';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from '../../models/login-user-dto';
import { ConfirmDialogComponent } from '../../helper/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskLogsComponent } from '../task-logs/task-logs.component';
import { TaskConfig } from '../../models/task-config';
import { decodeToken } from '../../helper/jwt-decode';
import { TaskService } from '../../services/task.service';
import { CategoryDto } from '../../models/related-dto';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  @ViewChild(TaskLogsComponent) taskLogsComponent!: TaskLogsComponent;

  notes: TaskNoteDto[] = [];
  users: UserDto[] = [];
  categories: CategoryDto[] = []; 

  task: any = {};
  isFieldNotDisabled: boolean = true;
  isEditMode: boolean = false;
  showAddNoteInput: boolean = false; 
  newNote: string = ''; 
  showLogs: boolean = false;
  userRole: string | null = "";
  selectedUserId: number = 0;
  isEditable: boolean = true;
  quillConfig = TaskConfig.quillConfig;
  taskId: number = 0;
  pageSize = 5;
  totalNotes = 0;
  relatedNameOptions: Array<{ id: number, name: string }> = [];
  isFirstExecution = true; 
  private optionsCache: { [categoryId: string]: any[] } = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private taskService: TaskService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userRole = decodeToken();
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchCategories();
    this.fetchUsers();

    if(this.taskId != 0){
      this.fetchTask();
      this.isEditMode = true;
      this.isFieldNotDisabled = false;
    }

    const isAllTasks = this.localStorageService.getItem('isAllTasks');
  
    if(this.userRole === "Admin" || isAllTasks === "true" || this.task?.isClosed == true)
      this.isEditable = false;
  }

  fetchNotes(page: number = 1, pageSize: number = 5): void {
    this.taskService.getNotesByTask(this.taskId, page, pageSize).pipe(
      take(1)
    ).subscribe(response => {
      this.notes = response.lstData;
      this.totalNotes = response.rowsCount;
    });
  }

  fetchCategories(): void {
    this.taskService.GetCategories().pipe(map(res => res.lstData), take(1)).subscribe(response =>
      this.categories = response
    );
  }

  fetchUsers(): void {
    this.taskService.getUsers().pipe(map(res => res.lstData)).subscribe(users =>
      this.users = users
    );
  }

  fetchTask(): void {
    this.taskService.getTask(this.taskId).pipe(take(1)).subscribe(x => {
      this.task = x;
      this.task.startDate = this.formatDate(this.task.startDate);
      this.task.deadLine = this.formatDate(this.task.deadLine);
      this.fetchNotes();
      this.fetchRelated();
    });
  }

  fetchRelated(): void {
    this.onRelatedToChange(this.task.categoryId);
  }
  
  reassignTask(userId: string): void {
    var task = {id: this.task.id, assignedToUserId: Number(userId)} as TaskDto;

    if (this.isEditMode) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: { 
          message: 'Are you sure you want to change the assignment of this task?',
          confirmButtonLabel: 'Reassign',
          confirmButtonColor: 'primary'
        }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.taskService.saveTask(task).subscribe(() => {
            this.toastr.success('Task reassigned successfully', 'Success');
            this.router.navigate([`/${this.userRole?.toLocaleLowerCase()}/task-list`]);
          });
        } else {
          this.toastr.error('Task reassigning was canceled', 'Error');
        }
      });
    }
  }

  onEdit(): void {
    this.isFieldNotDisabled = true;
  }

  onSave(): void {
    if (!this.isFieldNotDisabled) return;
    this.task.startDate = this.formatDate(this.task?.startDate);
    this.task.deadLine = this.formatDate(this.task?.deadLine);

    this.taskService.saveTask(this.task).subscribe(
      () => {
        this.isEditMode? this.fetchTask(): this.router.navigate([`/${this.userRole?.toLocaleLowerCase()}/task-list`]);
        this.isFieldNotDisabled = false;
        this.isFirstExecution = true;
        this.toastr.success('Task updated successfully', 'Success');
      },
      (error) => {
        if (error.status === 400) {
          this.toastr.error('One or more fields are required', 'Error');
        } else {
          this.toastr.error('Error updating task', 'Error');
        }
      }
    );
  }

  onCancel(): void {
    this.localStorageService.setItem('isAllTasks', 'false');
    this.isFieldNotDisabled = false;
    this.router.navigate([`/${this.userRole?.toLocaleLowerCase()}/task-list`]);
  }

  addNote(): void {
    if (this.newNote.trim() === '') return;
  
    const newNoteDto: CreateTaskNoteDto = {
      taskItemId: this.task.id,
      note: this.newNote.trim()
    };
  
    this.taskService.addNote(newNoteDto).subscribe(
      () => {
        this.fetchNotes();
        this.newNote = '';
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
      data: { 
        message: 'Are you sure you want to delete this task?',
        confirmButtonLabel: 'Delete',
        confirmButtonColor: 'warn' 
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(this.task.id).subscribe(() => {
          this.toastr.success('Task deleted successfully', 'Success');
          this.router.navigate([`/${this.userRole?.toLocaleLowerCase()}/task-list`]);
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
    this.taskLogsComponent.fetchLogs(this.taskId);
  }

  onNotesPageChange(event: any): void {
    const pageIndex = (event.pageIndex) + 1;
    const pageSize = event.pageSize;
    this.fetchNotes(pageIndex, pageSize);
  }

  onRelatedToChange(categoryId: any): void {  
    if (categoryId) {
      if (this.optionsCache[categoryId])
        this.relatedNameOptions = this.optionsCache[categoryId];
      else
        this.taskService.getRelatedNameOptions(categoryId).pipe(
          map(options => {
            return options.lstData.map(option => ({ id: option.id, name: option.name }));
          })
        ).subscribe(options => {
          this.relatedNameOptions = options;
          this.optionsCache[categoryId] = options;

          if (!this.isFirstExecution) {
            this.task.relatedToId = '';
          }
    
          this.isFirstExecution = false;
        });
    }
  }

  formatDate(date: any): string {
    if (!date) return '';
  
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2); 
    const day = ('0' + parsedDate.getDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
  }
  
  parseDate(dateString: string): Date | null {
    if (!dateString) return null;
  
    const [year, month, day] = dateString.split('-');
    return new Date(+year, +month - 1, +day);
  }
  
  onStartDateChange(newDate: string): void {
    this.task.startDate = this.formatDate(newDate);
  }
  
  onDeadLineChange(newDate: string): void {
    this.task.deadLine = this.formatDate(newDate);
  }
}
