import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map, take } from 'rxjs/operators';
import { TaskLogsDto } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-logs',
  templateUrl: './task-logs.component.html',
  styleUrls: ['./task-logs.component.css']
})
export class TaskLogsComponent implements OnInit {
  @Input() taskId!: number;
  @Input() userRole!: string | null;
  logs: TaskLogsDto[] = [];
  logsDataSource = new MatTableDataSource<TaskLogsDto>();
  displayedColumns: string[] = ['action', 'details', 'user', 'date'];
  pageSize = 5;
  totalNotes = 0;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.fetchLogs(this.taskId);
  }

  fetchLogs(taskId: number, page: number = 1, pageSize: number = 5): void {
    this.taskService.getTaskLogsByTaskId(taskId, page, pageSize).pipe(
      take(1)
    ).subscribe(res => {
      this.totalNotes = res.rowsCount;
      this.logs = res.lstData;
      this.logsDataSource.data = res.lstData;
    });
  }

  onPageChange(event: any): void {
    const currentPage = (event.pageIndex) + 1;
    this.pageSize = event.pageSize;
    this.fetchLogs(this.taskId, currentPage, this.pageSize);
  }
}
