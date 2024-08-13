import { CdkDragDrop, transferArrayItem, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { delay, map, Observable, of, tap } from 'rxjs';
import { TaskDto } from '../../models/task';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<TaskDto[]> = of([]);
  inProgressTasks$: Observable<TaskDto[]> = of([]);
  completedTasks$: Observable<TaskDto[]> = of([]);

  searchTerm: string = '';
  userRole: string | null = '';
  userId: number = 0;
  users: string[] = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Lee'];
  isAll: boolean = false
  isHovering: boolean = false; 

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.userRole = localStorage.getItem('userRole');
    this.loadTasks(this.userId); 
  }

  filteredTasks(tasks: TaskDto[]): TaskDto[] {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onTaskClick(task: TaskDto): void {
    this.router.navigate(['/user/task-details'], { state: { task } });
  }

  drop(event: CdkDragDrop<TaskDto[]>): void {
    if (event.previousContainer === event.container) {
      return;
    } else {
      this.closeTask(event.item.data);
    }
  }

  closeTask(taskId: number): void {
    this.userService.closeTask(taskId).subscribe(
      () => {
        this.toastr.success('Task closed successfully', 'Success');
        this.loadTasks(this.userId); 
      },
      error => {
        this.toastr.error('Error closing task', 'Error');
        console.error('Error closing task:', error);
      }
    );
  }

  loadTasks(userId: number): void {
    if (this.userRole == "Admin")
      this.tasks$ = this.adminService.getAllTasks(userId);
    else if (!this.isAll)
      this.tasks$ = this.userService.getAllTasksByUser(userId);
    else
      this.tasks$ = this.userService.getAllTasksWithoutUserId(userId);

    this.inProgressTasks$ = this.tasks$.pipe(
      map(tasks => tasks.filter(task => !task.isClosed))
    );
    this.completedTasks$ = this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.isClosed))
    );
  }

  handleTabChange(isAll: boolean) {
    this.isAll = isAll;
    this.loadTasks(this.userId);
  }

  // changeUser(task: TaskDto, newUserName: string): void {
  //   task.assignedToUserName = newUserName;
  //   console.log('User changed:', task);
  // }

  // onDropListEnter(): void {
  //   this.isHovering = true;
  // }

  // onDropListExit(): void {
  //   this.isHovering = false;
  // }
}
