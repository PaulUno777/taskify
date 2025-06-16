import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/category.model';


@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterLink,
  ],
  template: `
    <div class="category-header">
      <h2>Categories</h2>
      <button mat-raised-button color="primary" routerLink="/categories/new">
        <mat-icon>add</mat-icon> New Category
      </button>
    </div>

    <mat-card *ngIf="categories.length === 0" class="empty-state">
      <mat-icon>category</mat-icon>
      <h3>No categories yet</h3>
      <p>Create your first category to organize tasks</p>
    </mat-card>

    <div class="category-grid">
      <mat-card *ngFor="let category of categories" class="category-card">
        <mat-card-header>
          <div class="category-color" [style.background]="category.color"></div>
          <mat-card-title>{{ category.name }}</mat-card-title>
          <div class="spacer"></div>
          <div class="category-actions">
            <button
              mat-icon-button
              [routerLink]="['/categories', category.id, 'edit']"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="deleteCategory(category.id)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <p>{{ category.tasks.length || 0 }} tasks in this category</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
      }
      .category-card mat-card-header {
        align-items: center;
      }
      .category-color {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 16px;
      }
      .spacer {
        flex: 1 1 auto;
      }
      .category-actions {
        display: flex;
        gap: 8px;
      }
      .empty-state {
        text-align: center;
        padding: 40px;
      }
      .empty-state mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }
    `,
  ],
})
export class CategoryListComponent {
  private categoryService = inject(CategoryService);
  categories: Category[] = [];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.categories = this.categories.filter((c) => c.id !== id);
      });
    }
  }
}
