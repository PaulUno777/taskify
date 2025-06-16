import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './task-filter.component.html',
  styleUrl: './task-filter.component.css',
})
export class TaskFilterComponent {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  @Output() filterChanged = new EventEmitter<any>();
  categories: Category[] = [];

  filterForm = this.fb.group({
    search: [''],
    categoryId: [''],
    priority: [''],
    isCompleted: [''],
    dueDateFrom: [null],
    dueDateTo: [null],
  });

  ngOnInit() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  applyFilters() {
    this.filterChanged.emit(this.filterForm.value);
  }

  resetFilters() {
    this.filterForm.reset();
    this.filterChanged.emit(this.filterForm.value);
  }
}
