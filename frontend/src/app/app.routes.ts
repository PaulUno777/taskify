import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './modules/auth/profile/profile.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { TaskListComponent } from './modules/tasks/task-list/task-list.component';
import { TaskFormComponent } from './modules/tasks/task-form/task-form.component';

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
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'tasks',
        component: TaskListComponent,
      },
      {
        path: 'tasks/new',
        component: TaskFormComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];
