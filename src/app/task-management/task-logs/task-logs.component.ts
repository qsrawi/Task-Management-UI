import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { map, Observable, of } from 'rxjs';
import { TaskLogsDto } from '../../models/task';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-task-logs',
  templateUrl: './task-logs.component.html',
  styleUrls: ['./task-logs.component.css']
})
export class TaskLogsComponent implements OnInit {
  @Input() taskId!: number;
  @Input() userRole!: string | null;
  logs$: Observable<TaskLogsDto[]> = of([]);

  constructor(private userService: UserService, private adminService: AdminService) { }

  ngOnInit(): void {
    this.fetchLogs(this.taskId);
  }

  fetchLogs(taskId: number): void {
    this.logs$ = this.userRole == "User" 
    ? this.userService.getTaskLogsByTaskId(taskId).pipe(map(res =>res.lstData), map(logs => this.sortLogs(logs))) 
    : this.adminService.getTaskLogsByTaskId(taskId).pipe(map(res =>res.lstData), map(logs => this.sortLogs(logs)));
  }

  sortLogs(logs: TaskLogsDto[]): TaskLogsDto[] {
    return logs.sort((a, b) => {
      const priorityA = this.getActionPriority(a.action);
      const priorityB = this.getActionPriority(b.action);
      return priorityA - priorityB;
    });
  }

  getActionPriority(action: string): number {
    switch (action) {
      case 'Create':
        return 1;
      case 'Assign':
      case 'Update':
        return 2;
      case 'Closed':
        return 3;
      default:
        return 4;
    }
  }
}
