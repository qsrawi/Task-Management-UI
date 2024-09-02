import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TaskNoteDto, TaskLogsDto, CreateTaskNoteDto, TaskResponse, NoteResponse, LogResponse, TaskDto } from '../models/task';
import { UserDto, UserResponse } from '../models/login-user-dto';
import { CategoryResponse, RelatedDto, RelatedResponse } from '../models/related-dto';
import { GetTaskType } from '../models/get-task-type';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://localhost:7118/api/v1/Task';

  constructor(private http: HttpClient) {}

  getAllTasks(type: GetTaskType = GetTaskType.All, page: number = 1, pageSize: number = 5, strSearch?: string): Observable<TaskResponse> {
    let params = new HttpParams()
      .set('Type', type)
      .set('Page', page)
      .set('PageSize', pageSize);

      if (strSearch) {
        params = params.set('strSearch', strSearch);
      }

    return this.http.get<TaskResponse>(`${this.apiUrl}/GetAllTasks`, { params });
  }

  getNotesByTask(taskId: number, page: number, pageSize: number): Observable<NoteResponse> {
    let params = new HttpParams()
      .set('taskID', taskId)
      .set('page', page)
      .set('pageSize', pageSize);
  
    return this.http.get<NoteResponse>(`${this.apiUrl}/GetNotes`, { params });
  }

  addNote( note: CreateTaskNoteDto): Observable<TaskNoteDto> {
    return this.http.post<TaskNoteDto>(`${this.apiUrl}/AddNote`, note);
  }

  saveTask(task: TaskDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/SaveTask`, task);
  }

  getTaskLogsByTaskId(taskId: number, page: number, pageSize: number): Observable<LogResponse> {
    let params = new HttpParams()
      .set('taskID', taskId)
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<LogResponse>(`${this.apiUrl}/GetTaskLogs`, { params });
  }

  getUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/GetUsers`);
  }

  getTask(taskId: number): Observable<TaskDto> {
    let params = new HttpParams();
    params = params.set('taskID', taskId);
    
    return this.http.get<TaskDto>(`${this.apiUrl}/GetTask`, { params });
  }

  getRelated(categoryId: number): Observable<{ [key: string]: Array<{ id: number, name: string }> }> {
    let params = new HttpParams();
    params = params.set('categoryId', categoryId);

    return this.http.get<RelatedResponse>(`${this.apiUrl}/GetRelated`, { params }).pipe(
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

  getRelatedNameOptions(categoryId: number): Observable<RelatedResponse> {
    let params = new HttpParams();
    params = params.set('categoryId', categoryId);

    return this.http.get<RelatedResponse>(`${this.apiUrl}/GetRelated`, { params })
  }

  GetCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/GetCategories`);
  }

  deleteTask(taskId: number): Observable<any> {
    let req = {taskID: taskId};

    return this.http.put<any>(`${this.apiUrl}/DeleteTask`, req);
  }

  closeTask(taskId: number): Observable<any> {
    let req = {taskID: taskId};

    return this.http.put<any>(`${this.apiUrl}/CloseTask`,req);
  }
}
