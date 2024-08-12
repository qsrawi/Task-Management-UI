import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.css'
})
export class HeaderNavComponent {
  @Output() tabChange = new EventEmitter<boolean>();

  onTabClick(isAll: boolean) {
    this.tabChange.emit(isAll);
  }

  logout() {
    console.log('Logging out...');
  }
}
