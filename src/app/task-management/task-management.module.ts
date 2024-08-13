import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskManagementRoutingModule } from './task-management-routing.module';
import { TaskListComponent } from './task-list/task-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { HeaderNavComponent } from './header-nav/header-nav.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskLogsComponent } from './task-logs/task-logs.component';
import { QuillModule } from 'ngx-quill';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AddTaskComponent } from './add-task/add-task.component';

@NgModule({
  declarations: [
    TaskListComponent,
    TaskDetailsComponent,
    HeaderNavComponent,
    TaskLogsComponent,
    AddTaskComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaskManagementRoutingModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    QuillModule.forRoot(),
    MatDialogModule,
    MatButtonModule
  ]
})
export class TaskManagementModule { }
