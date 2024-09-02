import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { TaskDto, TaskResponse } from '../../models/task';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { decodeToken } from '../../helper/jwt-decode';
import { TaskService } from '../../services/task.service';
import { GetTaskType } from '../../models/get-task-type';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<TaskResponse> = of();
  inProgressTasks: TaskDto[] = [];
  completedTasks: TaskDto[] = [];

  searchTerm: string = '';
  userRole: string | null = '';
  isAll: boolean = false
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = decodeToken();
    this.loadTasks(); 
  }

  get totalPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    return Array(totalPages).fill(0).map((_, index) => index + 1); 
  }

  filteredTasks(tasks: TaskDto[]): TaskDto[] {
    return tasks.filter((task) =>
      task.title!.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onTaskClick(task: TaskDto): void {
    if(task.id != null)
      this.router.navigate([`/${this.userRole?.toLocaleLowerCase()}/task-details`, task.id]);
  }

  drop(event: CdkDragDrop<TaskDto[]>): void {
    if (event.previousContainer === event.container) {
      return;
    } else {
      this.closeTask(event.item.data);
    }
  }

  closeTask(taskId: number): void {
    this.taskService.closeTask(taskId).subscribe(
      () => {
        this.toastr.success('Task closed successfully', 'Success');
        this.loadTasks(); 
      },
      error => {
        this.toastr.error('Error closing task', 'Error');
        console.error('Error closing task:', error);
      }
    );
  }

  loadTasks(): void {
    this.tasks$ = this.taskService.getAllTasks(
      this.userRole === 'Admin' ? GetTaskType.All : !this.isAll ? GetTaskType.Include : GetTaskType.Exclude,
      this.currentPage,
      this.pageSize,
      this.searchTerm 
    );
    
    this.tasks$.subscribe(tasks => {
      this.inProgressTasks = tasks.lstData.filter(task => !task.isClosed)
      this.completedTasks = tasks.lstData.filter(task => task.isClosed)
      this.totalItems = tasks.rowsCount;
    })
  }

  handleTabChange(isAll: boolean) {
    this.isAll = isAll;
    this.loadTasks();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTasks();
  }
}
