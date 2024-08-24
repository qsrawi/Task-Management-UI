import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { decodeToken } from '../../helper/jwt-decode';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.css'
})
export class HeaderNavComponent {
  @Output() tabChange = new EventEmitter<boolean>();

  userRole: string | null = "";

  constructor(private router: Router){
    this.userRole = decodeToken();
  }

  onTabClick(isAll: boolean) {
    this.tabChange.emit(isAll);
    localStorage.setItem("isAllTasks", isAll.toString());
  }

  onAddClick() {
    this.router.navigate(['/admin/add-task']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
