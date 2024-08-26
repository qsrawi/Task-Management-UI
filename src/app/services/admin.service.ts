import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTaskDto, CreateTaskNoteDto, LogResponse, NoteResponse, TaskDto, TaskLogsDto, TaskNoteDto, TaskResponse } from '../models/task';
import { HttpClient } from '@angular/common/http';
import { UserDto, UserResponse } from '../models/login-user-dto';
import { SharedService } from './shared.service';
import { GetTaskType } from '../models/get-task-type';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminEndpoint = 'Admin';

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  getAllTasks(): Observable<TaskResponse> {
    return this.sharedService.getAllTasks(`${this.adminEndpoint}/GetAllTasks`, GetTaskType.All);
  }

  getTask(taskId: number): Promise<TaskDto> {
    return this.sharedService.getTask(`${this.adminEndpoint}/GetTask`, taskId);
  }

  addNote(note: CreateTaskNoteDto): Observable<TaskNoteDto> {
    return this.sharedService.addNote(`${this.adminEndpoint}/AddNote`, note);
  }

  getUsers(): Observable<UserResponse> {
    return this.sharedService.getUsers(`${this.adminEndpoint}/GetUsers`);
  }

  getRelated(): Observable<{ [key: string]: Array<{ id: number, name: string }> }> {
    return this.sharedService.getRelated(`${this.adminEndpoint}/GetRelated`);
  }

  getNotesByTask(taskId: number): Observable<NoteResponse> {
    return this.sharedService.getNotesByTask(`${this.adminEndpoint}/GetNotes`, taskId);
  }

  getTaskLogsByTaskId(taskId: number): Observable<LogResponse> {
    return this.sharedService.getTaskLogsByTaskId(`${this.adminEndpoint}/GetTaskLogs`, taskId);
  }

  saveTask(task: TaskDto): Observable<any> {
    return this.sharedService.saveTask(`${this.adminEndpoint}/SaveTask`, task);
  }

  /*deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/DeleteTask/${taskId}`);
  }*/
}
