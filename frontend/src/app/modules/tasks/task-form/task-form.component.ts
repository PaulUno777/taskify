import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import {
  CreateTaskDto,
  Task,
  UpdateTaskDto,
} from '../../../core/models/task.model';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { Priority } from '../../../core/models/priority.enum';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private categoryService = inject(CategoryService);

  @Input() task: Task | null = null;
  @Output() taskSaved = new EventEmitter<Task>();

  categories: Category[] = [];
  priorities = Object.values(Priority);
  showNewCategory = false;
  newCategoryName = '';
  newCategoryColor = '#3f51b5';

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: [Priority.MEDIUM, Validators.required],
    dueDate: [new Date()],
    categoryId: [''],
  });

  ngOnInit() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    if (this.task) {
      this.taskForm.patchValue({
        title: this.task?.title,
        description: this.task.description,
        priority: this.task.priority,
        dueDate: this.task.dueDate
          ? new Date(this.task.dueDate)
          : null,
        categoryId: this.task.category?.id || '',
      });
    }
  }

  onSubmit() {
    if (this.taskForm.invalid) return;

    const formValue = this.taskForm.value;

    const taskData = {
      ...formValue,
      dueDate: formValue?.dueDate
        ? (formValue.dueDate as Date).toISOString()
        : undefined,
      title: formValue?.title || '',
      description: formValue?.description || '',
      priority: formValue?.priority || Priority.LOW,
      categoryId: formValue?.categoryId || undefined,
    };

    if (this.task) {
      this.taskService.updateTask(this.task.id, taskData).subscribe((task) => {
        this.taskSaved.emit(task);
      });
    } else {
      this.taskService.createTask(taskData).subscribe((task) => {
        this.taskSaved.emit(task);
      });
    }
  }

  addNewCategory() {
    if (!this.newCategoryName) return;

    this.categoryService
      .createCategory({
        name: this.newCategoryName,
        color: this.newCategoryColor,
      })
      .subscribe((category) => {
        this.categories.push(category);
        this.taskForm.patchValue({ categoryId: category.id });
        this.showNewCategory = false;
        this.newCategoryName = '';
      });
  }

  cancelNewCategory() {
    this.showNewCategory = false;
    this.newCategoryName = '';
  }
}
