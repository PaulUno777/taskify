import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './modules/auth/profile/profile.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { TaskListComponent } from './modules/tasks/task-list/task-list.component';
import { TaskFormComponent } from './modules/tasks/task-form/task-form.component';
import { TaskDetailComponent } from './modules/tasks/task-detail/task-detail.component';
import { TaskShareComponent } from './modules/tasks/task-share/task-share.component';
import { CategoryListComponent } from './modules/categories/category-list/category-list.component';
import { CategoryFormComponent } from './modules/categories/category-form/category-form.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Tasks
      {
        path: 'tasks',
        component: TaskListComponent
      },
      {
        path: 'tasks/new',
        component: TaskFormComponent
      },
      {
        path: 'tasks/:id',
        component: TaskDetailComponent
      },
      {
        path: 'tasks/:id/edit',
        component: TaskFormComponent
      },
      {
        path: 'tasks/:id/share',
        component: TaskShareComponent
      },

      //Categories
      {
        path: 'categories',
        component: CategoryListComponent
      },
      {
        path: 'categories/new',
        component: CategoryFormComponent
      },
      {
        path: 'categories/:id/edit',
        component: CategoryFormComponent
      },

      // Profile
      { path: 'profile', component: ProfileComponent },

      // Default redirect
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];
