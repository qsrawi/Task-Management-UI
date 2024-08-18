import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreateTaskNoteDto, TaskDto, TaskLogsDto, TaskNoteDto } from '../models/task';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '../models/login-user-dto';
import { RelatedDto } from '../models/related-dto';

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

  getNotesByTask(taskId: number): Observable<TaskNoteDto[]> {
    return this.http.get<TaskNoteDto[]>(`${this.userApiUrl}/GetNotes/${taskId}`);
  }

  addNote(note: CreateTaskNoteDto): Observable<TaskNoteDto> {
    return this.http.post<TaskNoteDto>(`${this.userApiUrl}/AddNote`, note);
  }

  updateTask(task: TaskDto): Observable<TaskDto[]> {
    return this.http.put<TaskDto[]>(`${this.userApiUrl}/UpdateTask`, task);
  }

  getTaskLogsByTaskId(taskId: number): Observable<TaskLogsDto[]> {
    return this.http.get<TaskLogsDto[]>(`${this.userApiUrl}/GetTaskLogs/${taskId}`);
  }

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.userApiUrl}/GetUsers`);
  }

  assignTask(taskId: number, userId: string): Observable<void> {
    return this.http.post<void>(`${this.userApiUrl}/AssignTask/${taskId}/${userId}`, {});
  }

  getRelated(): Observable<{ [key: string]: Array<{ id: number, name: string }> }> {
    return this.http.get<RelatedDto[]>(`${this.userApiUrl}/GetRelated`).pipe(
      map((data: RelatedDto[]) => {
        return data.reduce((acc, current) => {
          const category = current.categoryName;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({ id: current.id, name: current.name });
          return acc;
        }, {} as { [key: string]: Array<{ id: number, name: string }> });
      })
    );
  }
  
  closeTask(taskId: number): Observable<void> {
    return this.http.post<void>(`${this.userApiUrl}/CloseTask/${taskId}`, {});
  }
}
