import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreateTaskDto, CreateTaskNoteDto, TaskDto, TaskLogsDto, TaskNoteDto } from '../models/task';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '../models/login-user-dto';
import { RelatedDto } from '../models/related-dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://localhost:7118/api';
  private adminApiUrl = `${this.apiUrl}/Admin`;

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<TaskDto[]> {
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

  getRelated(): Observable<{ [key: string]: Array<{ id: number, name: string }> }> {
    return this.http.get<RelatedDto[]>(`${this.adminApiUrl}/GetRelated`).pipe(
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
