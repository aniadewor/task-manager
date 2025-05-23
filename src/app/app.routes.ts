import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
  path: 'tasks',
  loadComponent: () => import('./tasks/task-list/task-list.component').then(m => m.TaskListComponent)
},
{
  path: 'tasks/add',
  loadComponent: () => import('./tasks/task-add/task-add.component').then(m => m.TaskAddComponent)
},
{
  path: 'tasks/edit/:id',
  loadComponent: () => import('./tasks/task-edit/task-edit.component').then(m => m.TaskEditComponent)
},
];
