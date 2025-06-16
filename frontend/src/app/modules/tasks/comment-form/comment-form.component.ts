import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CreateMessageDto, Message } from 'src/app/core/models/message.model';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css',
})
export class CommentFormComponent {
  private fb = inject(FormBuilder);
  private commentService = inject(MessageService);

  @Input() taskId!: string;
  @Output() commentAdded = new EventEmitter<Message>();
  commentForm = this.fb.group({
    content: ['', Validators.required],
  });

  loading = false;

  onSubmit() {
    if (this.commentForm.invalid || !this.taskId) return;
    this.loading = true;
    const content = this.commentForm.value.content!;
    this.commentForm.disable();

    this.commentService.createComment(this.taskId, { content }).subscribe({
      next: (newComment) => {
        this.commentAdded.emit(newComment);
        this.commentForm.reset();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error adding comment!', err);
        this.loading = false;
        this.commentForm.enable();
      },
    });
  }
}
