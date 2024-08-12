import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDto } from '../models/task';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7118/api';
  private userApiUrl = `${this.apiUrl}/User`;

  constructor(private http: HttpClient) {}

  getAllTasksByUser(userId: number): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.userApiUrl}/GetAllTasksByUser/${userId}`);
  }

  getAllTasksWithoutUserId(userId: number): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.userApiUrl}/GetAllTasksWithoutUserId/${userId}`);
  }

  closeTask(taskId: number): Observable<void> {
    return this.http.post<void>(`${this.userApiUrl}/CloseTask/${taskId}`, {});
  }
}
