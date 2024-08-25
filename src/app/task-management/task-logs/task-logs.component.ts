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
    ? this.userService.getTaskLogsByTaskId(taskId).pipe(map(res =>res.lstData)) 
    : this.adminService.getTaskLogsByTaskId(taskId).pipe(map(res =>res.lstData));
  }
}
