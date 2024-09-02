import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { decodeToken } from '../../helper/jwt-decode';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.css'
})
export class HeaderNavComponent {
  @Output() tabChange = new EventEmitter<boolean>();

  userRole: string | null = "";

  constructor(private router: Router, private localStorageService: LocalStorageService){
    this.userRole = decodeToken();
  }

  onTabClick(isAll: boolean) {
    this.tabChange.emit(isAll);
    this.localStorageService.setItem('isAllTasks', isAll.toString());
  }

  onAddClick() {
    this.router.navigate(['/admin/add-task']);
  }

  logout() {
    this.localStorageService.clear();
    this.router.navigate(['/']);
  }
}
