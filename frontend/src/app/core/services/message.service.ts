import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateMessageDto, Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/messages`;

  getCommentsByTask(taskId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${taskId}`);
  }

  createComment(
    taskId: string,
    commentData: CreateMessageDto
  ): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/${taskId}`, commentData);
  }

  updateComment(
    id: string,
    taskId: string,
    commentData: CreateMessageDto
  ): Observable<Message> {
    return this.http.put<Message>(
      `${this.apiUrl}/${taskId}/${id}`,
      commentData
    );
  }

  deleteComment(id: string, taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}${id}`);
  }
}
