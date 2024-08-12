import { Routes } from '@angular/router';


export const routes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
    { path: 'user', loadChildren: () => import('./task-management/task-management.module').then(m => m.TaskManagementModule) },
];
