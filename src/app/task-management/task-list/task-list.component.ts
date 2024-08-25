import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { TaskDto, TaskResponse } from '../../models/task';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { decodeToken } from '../../helper/jwt-decode';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<TaskResponse> = of();
  inProgressTasks$: Observable<TaskDto[]> = of([]);
  completedTasks$: Observable<TaskDto[]> = of([]);

  searchTerm: string = '';
  userRole: string | null = '';
  isAll: boolean = false

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = decodeToken();
    this.loadTasks(); 
  }

  filteredTasks(tasks: TaskDto[]): TaskDto[] {
    return tasks.filter((task) =>
      task.title!.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onTaskClick(task: TaskDto): void {
    this.router.navigate([`/${this.userRole?.toLocaleLowerCase()}/task-details`], { state: { task } });
  }

  drop(event: CdkDragDrop<TaskDto[]>): void {
    if (event.previousContainer === event.container) {
      return;
    } else {
      this.closeTask(event.item.data);
    }
  }

  closeTask(taskId: number): void {
    var task = {
      id: taskId,
      isClosed : true,
    } as TaskDto

    this.userService.saveTask(task).subscribe(
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
    if (this.userRole == "Admin")
      this.tasks$ = this.adminService.getAllTasks();
    else if (!this.isAll)
      this.tasks$ = this.userService.getAllTasksByUser();
    else
      this.tasks$ = this.userService.getAllTasksWithoutUserId();

    this.inProgressTasks$ = this.tasks$.pipe(
      map(tasks => tasks.lstData.filter(task => !task.isClosed))
    );
    this.completedTasks$ = this.tasks$.pipe(
      map(tasks => tasks.lstData.filter(task => task.isClosed))
    );
  }

  handleTabChange(isAll: boolean) {
    this.isAll = isAll;
    this.loadTasks();
  }
}
