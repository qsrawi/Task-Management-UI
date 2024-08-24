import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Observable, of } from 'rxjs';
import { UserDto } from '../../models/login-user-dto';
import { ToastrService } from 'ngx-toastr';
import { TaskConfig } from '../../models/task-config';
import { decodeToken } from '../../helper/jwt-decode';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  users$: Observable<UserDto[]> = of([]);

  addTaskForm: FormGroup;
  userName: string | null = "";
  quillConfig = TaskConfig.quillConfig;
  relatedNameOptions: Array<{ id: number, name: string }> = [];
  relatedOptionsByCategory: { [key: string]: Array<{ id: number, name: string }> } = {};

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.users$ = this.adminService.getUsers();
    this.addTaskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      assignedToUserId: ['', Validators.required],
      relatedTo: ['', Validators.required],
      relatedToId: ['', Validators.required],
      startDate: ['', Validators.required],
      deadLine: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.adminService.getRelated().subscribe((data) => {
      this.relatedOptionsByCategory = data;
    });
  }

  onSubmit(): void {
    if (this.addTaskForm.valid) {
      const newTask = {
        ...this.addTaskForm.value
      };

      this.adminService.createTask(newTask).subscribe(() => {
        this.toastr.success('Task deleted successfully', 'Success');
        this.router.navigate(['/admin/task-list']);
      });
    }
  }

  onRelatedToChange(event: Event): void {
    const relatedTo = (event.target as HTMLSelectElement).value;
    this.updateRelatedNameOptions(relatedTo);
  
    this.addTaskForm.get('relatedToId')?.setValue('');
  }

  updateRelatedNameOptions(relatedTo: string): void {
    this.relatedNameOptions = this.relatedOptionsByCategory[relatedTo] || [];
  }

  onCancel(): void {
    this.router.navigate(['/admin/task-list']);
  }
}
