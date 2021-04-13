import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, RouterEvent } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectToHomePageGuardIfAuth implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) {}

  /**
   * Return True if the user is not Authenticated to navigate to Login Page,
   * otherwise it get redirected to Home Page.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
    return true;
  }
}
