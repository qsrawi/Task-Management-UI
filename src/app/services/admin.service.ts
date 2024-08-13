import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTaskDto, CreateTaskNoteDto, TaskDto, TaskLogsDto, TaskNoteDto } from '../models/task';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '../models/login-user-dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://localhost:7118/api';
  private adminApiUrl = `${this.apiUrl}/Admin`;

  constructor(private http: HttpClient) {}

  getAllTasks(userId: number): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.adminApiUrl}/GetAllTasks`);
  }

  addNote(note: CreateTaskNoteDto): Observable<TaskNoteDto> {
    return this.http.post<TaskNoteDto>(`${this.adminApiUrl}/AddNote`, note);
  }

  createTask(task: CreateTaskDto): Observable<any> {
    return this.http.post(`${this.adminApiUrl}/CreateTask`, task);
  }

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.adminApiUrl}/GetUsers`);
  }

  getNotesByTask(taskId: number): Observable<TaskNoteDto[]> {
    return this.http.get<TaskNoteDto[]>(`${this.adminApiUrl}/GetNotes/${taskId}`);
  }

  getTaskLogsByTaskId(taskId: number): Observable<TaskLogsDto[]> {
    return this.http.get<TaskLogsDto[]>(`${this.adminApiUrl}/GetTaskLogs/${taskId}`);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/DeleteTask/${taskId}`);
  }
}
