import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Category, CreateCategoryDto } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/categories`;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(categoryData: CreateCategoryDto): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, categoryData);
  }

  updateCategory(
    id: string,
    categoryData: CreateCategoryDto
  ): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, categoryData);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
