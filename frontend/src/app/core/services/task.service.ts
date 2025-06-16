import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TasksResponse,
} from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/tasks`;

  getTasks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    priority?: string;
    isCompleted?: boolean;
    dueDateFrom?: string;
    dueDateTo?: string;
  }): Observable<TasksResponse> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }

    return this.http.get<TasksResponse>(this.apiUrl, {
      params: httpParams,
    });
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(taskData: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData);
  }

  updateTask(id: string, taskData: UpdateTaskDto): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, taskData);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markAsComplete(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/complete`, {});
  }

  shareTask(taskId: string, userId: string): Observable<Task> {
    return this.http.post<Task>(
      `${this.apiUrl}/${taskId}/share-with/${userId}`,
      {}
    );
  }

  unshareTask(taskId: string, userId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${taskId}/unshare-with/${userId}`
    );
  }
}
