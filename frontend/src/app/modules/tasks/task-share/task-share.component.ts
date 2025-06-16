import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-task-share',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Share Task</mat-card-title>
        <mat-card-subtitle
          >Share "{{ taskTitle }}" with other users</mat-card-subtitle
        >
      </mat-card-header>

      <mat-card-content>
        <div *ngIf="searchResults.length > 0" class="search-results">
          <mat-list>
            <mat-list-item *ngFor="let user of searchResults">
              <div class="user-info">
                <div class="avatar">
                  {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                </div>
                <div>
                  <h4>{{ user.firstName }} {{ user.lastName }}</h4>
                  <p>{{ user.email }}</p>
                </div>
              </div>
              <button mat-icon-button (click)="shareWithUser(user)">
                <mat-icon>person_add</mat-icon>
              </button>
            </mat-list-item>
          </mat-list>
        </div>

        <div *ngIf="shares.length > 0" class="shared-with">
          <h3>Currently shared with:</h3>
          <mat-chip-listbox>
            <mat-chip
              *ngFor="let share of shares"
              (removed)="unshareWithUser(share.user)"
            >
              {{ share.user.firstName }} {{ share.user.lastName }}
              <mat-icon matChipRemove>cancel</mat-icon>
            </mat-chip>
          </mat-chip-listbox>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .search-container {
        margin-bottom: 24px;
      }
      .user-info {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
      }
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #3f51b5;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
      .shared-with {
        margin-top: 24px;
      }
    `,
  ],
})
export class TaskShareComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  taskId!: string;
  taskTitle = '';
  shares: { user: User }[] = [];
  searchControl = new FormControl('');
  searchResults: User[] = [];

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id')!;
    this.loadTaskDetails();
  }

  loadTaskDetails() {
    this.taskService.getTaskById(this.taskId).subscribe((task) => {
      this.taskTitle = task.title;
      this.shares = task.shares;
    });
  }

  shareWithUser(user: User) {
    this.taskService.shareTask(this.taskId, user.id).subscribe(() => {
      this.shares.push({ user });
      this.searchResults = this.searchResults.filter((u) => u.id !== user.id);
    });
  }

  unshareWithUser(user: User) {
    this.taskService.unshareTask(this.taskId, user.id).subscribe(() => {
      this.shares = this.shares.filter((u) => u.user.id !== user.id);
    });
  }
}
