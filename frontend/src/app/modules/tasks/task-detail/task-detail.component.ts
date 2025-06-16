import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Task } from '../../../core/models/task.model';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { AuthService } from '../../../core/services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskService } from 'src/app/core/services/task.service';
import { MessageService } from 'src/app/core/services/message.service';
import { Message } from 'src/app/core/models/message.model';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatDividerModule,
    DatePipe,
    RouterLink,
    CommentFormComponent,
    MatTooltipModule,
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
})
export class TaskDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private commentService = inject(MessageService);
  private authService = inject(AuthService);

  task: Task | null = null;
  comments: Message[] = [];
  currentUser: User | null = null;

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(taskId);
    }
  }

  loadTask(id: string) {
    this.taskService.getTaskById(id).subscribe((task) => {
      this.task = task;
      this.comments = task.comments?.length ? task.comments : [];
    });
  }

  loadComments(taskId: string) {
    this.commentService.getCommentsByTask(taskId).subscribe((comments) => {
      this.comments = comments;
    });
  }

  deleteTask() {
    if (this.task && confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task.id).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }

  addComment(comment: Message) {
    this.comments = [...this.comments, comment];
  }

  editComment(comment: Message) {
    // Implementation for edit comment
  }

  deleteComment(commentId: string) {
    if (confirm('Are you sure you want to delete this comment?')) {
      const taskId = this.route.snapshot.paramMap.get('id');
      if (taskId) {
        this.commentService.deleteComment(commentId, taskId).subscribe(() => {
          this.comments = this.comments.filter((c) => c.id !== commentId);
        });
      }
    }
  }

  isCommentOwner(comment: Message): boolean {
    return this.currentUser?.id === comment.author.id;
  }
}
