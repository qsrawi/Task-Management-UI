import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Observable, of } from 'rxjs';
import { UserDto } from '../../models/login-user-dto';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  users$: Observable<UserDto[]> = of([]);

  addTaskForm: FormGroup;
  userId: string | null = "";

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.users$ = this.adminService.getUsers();
    this.addTaskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      assignedToUserId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
  }

  onSubmit(): void {
    if (this.addTaskForm.valid) {
      const newTask = {
        ...this.addTaskForm.value,
        creatorUserId: this.userId
      };
      this.adminService.createTask(newTask).subscribe(() => {
        alert('Task created successfully');
        this.router.navigate(['/admin/task-list', this.userId]);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/task-list', this.userId]);
  }
}
