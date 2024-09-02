import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
    {
      path: 'user',
      loadChildren: () => import('./task-management/task-management.module').then(m => m.TaskManagementModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'admin',
      loadChildren: () => import('./task-management/task-management.module').then(m => m.TaskManagementModule),
      canActivate: [AuthGuard]
    },
];
