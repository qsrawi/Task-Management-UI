import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDto } from '../models/task';
import { HttpClient } from '@angular/common/http';

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
}
