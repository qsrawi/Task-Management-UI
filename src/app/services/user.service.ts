import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTaskNoteDto, TaskDto, TaskLogsDto, TaskNoteDto } from '../models/task';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '../models/login-user-dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userApiUrl = 'https://localhost:7118/api/User';
  private userEndpoint = 'User';

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  getAllTasksByUser(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.userApiUrl}/GetAllTasksByUser`);
  }

  getAllTasksWithoutUserId(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.userApiUrl}/GetAllTasksWithoutUserId`);
  }

  getNotesByTask(taskId: number): Observable<TaskNoteDto[]> {
    return this.sharedService.getNotesByTask(`${this.userEndpoint}/GetNotes`, taskId);
  }

  addNote(note: CreateTaskNoteDto): Observable<TaskNoteDto> {
    return this.sharedService.addNote(`${this.userEndpoint}/AddNote`, note);
  }

  updateTask(task: TaskDto): Observable<TaskDto[]> {
    return this.http.put<TaskDto[]>(`${this.userApiUrl}/UpdateTask`, task);
  }

  getTaskLogsByTaskId(taskId: number): Observable<TaskLogsDto[]> {
    return this.sharedService.getTaskLogsByTaskId(`${this.userEndpoint}/GetTaskLogs`, taskId);
  }

  getUsers(): Observable<UserDto[]> {
    return this.sharedService.getUsers(`${this.userEndpoint}/GetUsers`);
  }

  assignTask(taskId: number, userId: string): Observable<void> {
    return this.http.post<void>(`${this.userApiUrl}/AssignTask/${taskId}/${userId}`, {});
  }

  getRelated(): Observable<{ [key: string]: Array<{ id: number, name: string }> }> {
    return this.sharedService.getRelated(`${this.userEndpoint}/GetRelated`);
  }
  
  closeTask(taskId: number): Observable<void> {
    return this.http.post<void>(`${this.userApiUrl}/CloseTask/${taskId}`, {});
  }
}
