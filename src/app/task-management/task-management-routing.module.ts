import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailsComponent } from './task-details/task-details.component';

const routes: Routes = [
  { path: 'task-list/:id', component: TaskListComponent },
  { path: 'task-details', component: TaskDetailsComponent },
  { path: 'all-task-list/:id', component: TaskListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskManagementRoutingModule { }
