import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule, DatePipe } from '@angular/common';
import { Task } from '../../../core/models/task.model';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskService } from 'src/app/core/services/task.service';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import { TruncatePipe } from 'src/app/shared/pipes/truncate.pipe';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    DatePipe,
    RouterLink,
    MatPaginatorModule,
    MatTooltipModule,
    TaskFilterComponent,
    TruncatePipe,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  tasks: Task[] = [];
  totalTasks = 0;
  currentPage = 1;
  pageSize = 10;
  filters: any = {};

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService
      .getTasks({
        page: this.currentPage + 1,
        limit: this.pageSize,
        ...this.filters,
      })
      .subscribe((response) => {
        this.tasks = response.data;
        this.totalTasks = response.metadata.total;
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTasks();
  }

  applyFilters(filters: any) {
    this.filters = filters;
    this.currentPage = 0;
    this.loadTasks();
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }
}
