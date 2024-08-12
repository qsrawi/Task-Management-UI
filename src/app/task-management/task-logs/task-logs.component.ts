import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { TaskLogsDto } from '../../models/task';

@Component({
  selector: 'app-task-logs',
  templateUrl: './task-logs.component.html',
  styleUrls: ['./task-logs.component.css']
})
export class TaskLogsComponent implements OnInit {
  @Input() taskId!: number;
  logs$: Observable<TaskLogsDto[]> = of([]);

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.fetchLogs(this.taskId);
  }

  fetchLogs(taskId: number): void {
    this.logs$ = this.userService.getTaskLogsByTaskId(taskId)
    this.userService.getTaskLogsByTaskId(taskId).subscribe(x => console.log(x));
  
  }
}
