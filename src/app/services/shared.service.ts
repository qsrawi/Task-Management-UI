import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TaskNoteDto, TaskLogsDto, CreateTaskNoteDto, TaskResponse, NoteResponse, LogResponse, TaskDto } from '../models/task';
import { UserDto, UserResponse } from '../models/login-user-dto';
import { RelatedDto, RelatedResponse } from '../models/related-dto';
import { GetTaskType } from '../models/get-task-type';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private apiUrl = 'https://localhost:7118/api/v1';

  constructor(private http: HttpClient) {}

  getAllTasks(endpoint: string, type: GetTaskType = GetTaskType.All): Observable<TaskResponse> {
    let params = new HttpParams();
    params = params.set('Type', type);

    return this.http.get<TaskResponse>(`${this.apiUrl}/${endpoint}`, { params });
  }

  getNotesByTask(endpoint: string, taskId: number): Observable<NoteResponse> {
    let params = new HttpParams();
    params = params.set('taskID', taskId);

    return this.http.get<NoteResponse>(`${this.apiUrl}/${endpoint}`, { params });
  }

  addNote(endpoint: string, note: CreateTaskNoteDto): Observable<TaskNoteDto> {
    return this.http.post<TaskNoteDto>(`${this.apiUrl}/${endpoint}`, note);
  }

  saveTask(endpoint: string, task: TaskDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, task);
  }

  getTaskLogsByTaskId(endpoint: string, taskId: number): Observable<LogResponse> {
    let params = new HttpParams();
    params = params.set('taskID', taskId);

    return this.http.get<LogResponse>(`${this.apiUrl}/${endpoint}`, { params });
  }

  getUsers(endpoint: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${endpoint}`);
  }

  getRelated(endpoint: string): Observable<{ [key: string]: Array<{ id: number, name: string }> }> {
    return this.http.get<RelatedResponse>(`${this.apiUrl}/${endpoint}`).pipe(
      map((data: RelatedResponse) => {
        return data.lstData.reduce((acc, current) => {
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
