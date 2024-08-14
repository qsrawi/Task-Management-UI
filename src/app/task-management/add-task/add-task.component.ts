import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Observable, of } from 'rxjs';
import { UserDto } from '../../models/login-user-dto';
import { ToastrService } from 'ngx-toastr';
import { TaskConfig } from '../../models/task-config';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  users$: Observable<UserDto[]> = of([]);

  addTaskForm: FormGroup;
  userId: string | null = "";
  userName: string | null = "";
  relatedNameOptions: string[] = [];
  quillConfig = TaskConfig.quillConfig;
  projectOptions = TaskConfig.projectOptions;
  companyOptions = TaskConfig.companyOptions;
  personalOptions = TaskConfig.personalOptions;

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
      relatedName: ['', Validators.required],
      startDate: ['', Validators.required],
      deadLine: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.userName = localStorage.getItem('userName');
  }

  onSubmit(): void {
    if (this.addTaskForm.valid) {
      const newTask = {
        ...this.addTaskForm.value,
        creatorUserId: this.userId,
        createdBy: this.userName
      };
      this.adminService.createTask(newTask).subscribe(() => {
        this.toastr.success('Task deleted successfully', 'Success');
        this.router.navigate(['/admin/task-list', this.userId]);
      });
    }
  }

  onRelatedToChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    switch (selectedValue) {
      case 'Project':
        this.relatedNameOptions = this.projectOptions;
        break;
      case 'Company':
        this.relatedNameOptions = this.companyOptions;
        break;
      case 'Personal':
        this.relatedNameOptions = this.personalOptions;
        break;
      default:
        this.relatedNameOptions = [];
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/task-list', this.userId]);
  }
}
