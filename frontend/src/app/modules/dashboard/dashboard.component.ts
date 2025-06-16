import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Task, TasksResponse } from 'src/app/core/models/task.model';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  overdueTasks = 0;

  priorityChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#f44336', '#ff9800', '#4caf50'],
      },
    ],
  };

  completionChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#4caf50', '#ff9800'],
      },
    ],
  };

  constructor(private taskService: TaskService) {
    this.loadTaskStats();
  }

  loadTaskStats() {
    this.taskService.getTasks().subscribe((response: TasksResponse) => {
      const tasks = response.data;

      this.totalTasks = tasks.length;
      this.completedTasks = tasks.filter((t) => t.isCompleted).length;
      this.pendingTasks = this.totalTasks - this.completedTasks;

      const now = new Date();
      this.overdueTasks = tasks.filter(
        (t: Task) => !t.isCompleted && t.dueDate && new Date(t.dueDate) < now
      ).length;

      // Priority distribution
      const priorities = tasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      this.priorityChartData.datasets[0].data = [
        priorities['HIGH'] || 0,
        priorities['MEDIUM'] || 0,
        priorities['LOW'] || 0,
      ];

      // Completion rate
      this.completionChartData.datasets[0].data = [
        this.completedTasks,
        this.pendingTasks,
      ];
    });
  }
}
