import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TaskDto, TaskNoteDto, TaskLogsDto, CreateTaskNoteDto } from '../models/task';
import { UserDto } from '../models/login-user-dto';
import { RelatedDto } from '../models/related-dto';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private apiUrl = 'https://localhost:7118/api';

  constructor(private http: HttpClient) {}

  getAllTasks(endpoint: string): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.apiUrl}/${endpoint}`);
  }

  getNotesByTask(endpoint: string, taskId: number): Observable<TaskNoteDto[]> {
    return this.http.get<TaskNoteDto[]>(`${this.apiUrl}/${endpoint}/${taskId}`);
  }

  addNote(endpoint: string, note: CreateTaskNoteDto): Observable<TaskNoteDto> {
    return this.http.post<TaskNoteDto>(`${this.apiUrl}/${endpoint}`, note);
  }

  getTaskLogsByTaskId(endpoint: string, taskId: number): Observable<TaskLogsDto[]> {
    return this.http.get<TaskLogsDto[]>(`${this.apiUrl}/${endpoint}/${taskId}`);
  }

  getUsers(endpoint: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/${endpoint}`);
  }

  getRelated(endpoint: string): Observable<{ [key: string]: Array<{ id: number, name: string }> }> {
    return this.http.get<RelatedDto[]>(`${this.apiUrl}/${endpoint}`).pipe(
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
}
