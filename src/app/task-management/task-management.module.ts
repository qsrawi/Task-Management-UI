import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskManagementRoutingModule } from './task-management-routing.module';
import { TaskListComponent } from './task-list/task-list.component';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { HeaderNavComponent } from './header-nav/header-nav.component';


@NgModule({
  declarations: [
    TaskListComponent,
    HeaderNavComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TaskManagementRoutingModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ]
})
export class TaskManagementModule { }
