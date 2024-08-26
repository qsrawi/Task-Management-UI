import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { CreateTaskNoteDto, LogResponse, NoteResponse, TaskDto, TaskLogsDto, TaskNoteDto, TaskResponse } from '../models/task';
import { HttpClient } from '@angular/common/http';
import { UserDto, UserResponse } from '../models/login-user-dto';
import { SharedService } from './shared.service';
import { GetTaskType } from '../models/get-task-type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userApiUrl = 'https://localhost:7118/api/v1/User';
  private userEndpoint = 'User';

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  getAllTasksByUser(): Observable<TaskResponse> {
    return this.sharedService.getAllTasks(`${this.userEndpoint}/GetAllTasks`, GetTaskType.Include);
  }

  getAllTasksWithoutUserId(): Observable<TaskResponse> {
    return this.sharedService.getAllTasks(`${this.userEndpoint}/GetAllTasks`, GetTaskType.Exclude);
  }

  getTask(taskId: number): Promise<TaskDto> {
    return this.sharedService.getTask(`${this.userEndpoint}/GetTask`, taskId);
  }

  getNotesByTask(taskId: number): Observable<NoteResponse> {
    return this.sharedService.getNotesByTask(`${this.userEndpoint}/GetNotes`, taskId);
  }

  addNote(note: CreateTaskNoteDto): Observable<TaskNoteDto> {
    return this.sharedService.addNote(`${this.userEndpoint}/AddNote`, note);
  }

  saveTask(task: TaskDto): Observable<any> {
    return this.sharedService.saveTask(`${this.userEndpoint}/SaveTask`, task);
  }

  getTaskLogsByTaskId(taskId: number): Observable<LogResponse> {
    return this.sharedService.getTaskLogsByTaskId(`${this.userEndpoint}/GetTaskLogs`, taskId);
  }

  getUsers(): Observable<UserResponse> {
    return this.sharedService.getUsers(`${this.userEndpoint}/GetUsers`);
  }

  assignTask(taskId: number, userId: string): Observable<void> {
    return this.http.post<void>(`${this.userApiUrl}/AssignTask/${taskId}/${userId}`, {});
  }

  getRelated(): Observable<{ [key: string]: Array<{ id: number, name: string }> }> {
    return this.sharedService.getRelated(`${this.userEndpoint}/GetRelated`);
  }
  
  /*closeTask(taskId: number): Observable<void> {
    return this.http.post<void>(`${this.userApiUrl}/CloseTask/${taskId}`, {});
  }*/
}
