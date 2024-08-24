import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTaskDto, CreateTaskNoteDto, TaskDto, TaskLogsDto, TaskNoteDto, TaskResponse } from '../models/task';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '../models/login-user-dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminApiUrl = 'https://localhost:7118/api/Admin';
  private adminEndpoint = 'Admin';

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  getAllTasks(): Observable<TaskResponse> {
    return this.sharedService.getAllTasks(`${this.adminEndpoint}/GetAllTasks`);
  }

  addNote(note: CreateTaskNoteDto): Observable<TaskNoteDto> {
    return this.sharedService.addNote(`${this.adminEndpoint}/AddNote`, note);
  }

  createTask(task: CreateTaskDto): Observable<any> {
    return this.http.post(`${this.adminApiUrl}/CreateTask`, task);
  }

  getUsers(): Observable<UserDto[]> {
    return this.sharedService.getUsers(`${this.adminEndpoint}/GetUsers`);
  }

  getRelated(): Observable<{ [key: string]: Array<{ id: number, name: string }> }> {
    return this.sharedService.getRelated(`${this.adminEndpoint}/GetRelated`);
  }

  getNotesByTask(taskId: number): Observable<TaskNoteDto[]> {
    return this.sharedService.getNotesByTask(`${this.adminEndpoint}/GetNotes`, taskId);
  }

  getTaskLogsByTaskId(taskId: number): Observable<TaskLogsDto[]> {
    return this.sharedService.getTaskLogsByTaskId(`${this.adminEndpoint}/GetTaskLogs`, taskId);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/DeleteTask/${taskId}`);
  }
}
