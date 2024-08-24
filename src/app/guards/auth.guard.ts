import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { decodeToken } from '../helper/jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const userRole = decodeToken();
    
    if (userRole) {
      const routeRole = next.url[0].path;
      
      if ((routeRole === 'user' && userRole === 'User') || (routeRole === 'admin' && userRole === 'Admin')) {
        return true;
      } else {
        this.router.navigate(['/auth/login']);
        return false;
      }
    } else {
      this.router.navigate(['/auth/login']);
      return false; 
    }
  }
}
