import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{
          isEditMode ? 'Edit Category' : 'Create New Category'
        }}</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Category Name</mat-label>
            <input matInput formControlName="name" />
            <mat-error *ngIf="categoryForm.controls.name.invalid">
              Name is required
            </mat-error>
          </mat-form-field>

          <div class="color-picker">
            <label>Select Color:</label>
            <div class="color-options">
              <div
                *ngFor="let color of colorOptions"
                class="color-option"
                [style.background]="color"
                [class.selected]="categoryForm.value.color === color"
                (click)="selectColor(color)"
              ></div>
            </div>
          </div>

          <div class="form-actions">
            <button mat-button type="button" routerLink="/categories">
              Cancel
            </button>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="categoryForm.invalid"
            >
              {{ isEditMode ? 'Update Category' : 'Create Category' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .color-picker {
        margin: 16px 0;
      }
      .color-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
      .color-option {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid transparent;
      }
      .color-option.selected {
        border-color: #3f51b5;
        transform: scale(1.1);
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 16px;
      }
    `,
  ],
})
export class CategoryFormComponent {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  categoryId: string | null = null;
  colorOptions = [
    '#3f51b5',
    '#f44336',
    '#4caf50',
    '#ff9800',
    '#9c27b0',
    '#00bcd4',
  ];

  categoryForm = this.fb.group({
    name: ['', Validators.required],
    color: ['#3f51b5', Validators.required],
  });

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id');

    if (this.categoryId) {
      this.isEditMode = true;
      this.categoryService
        .getCategoryById(this.categoryId)
        .subscribe((category) => {
          this.categoryForm.patchValue({
            name: category.name,
            color: category.color,
          });
        });
    }
  }

  selectColor(color: string) {
    this.categoryForm.patchValue({ color });
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;
    this.categoryForm.disable()

    const { color = '', name = '' } = this.categoryForm.value;

    if (this.isEditMode && this.categoryId) {
      this.categoryService
        .updateCategory(this.categoryId, { color: color!, name: name! })
        .subscribe(() => {
          this.router.navigate(['/categories']);
        });
    } else {
      this.categoryService
        .createCategory({ color: color!, name: name! })
        .subscribe(() => {
          this.router.navigate(['/categories']);
        });
    }
    this.categoryForm.enable()
  }
}
