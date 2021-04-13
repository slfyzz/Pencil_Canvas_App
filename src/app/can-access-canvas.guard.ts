import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { CanvasesService } from './canvases.service';

@Injectable({
  providedIn: 'root'
})
export class CanAccessCanvasGuard implements CanActivate {

  constructor(private canvasService: CanvasesService, private router: Router, private auth: AuthenticationService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.auth.isAuthenticated()) {
      return false;
    }

    const userID = route.paramMap.get('userID');
    const canvasID = route.paramMap.get('canvasID');

    if (!userID || !canvasID || (userID !== this.auth.getUserUID() && !this.canvasService.canAccess(userID, canvasID))) {
      // this canvas is not reachable for the current user.
      return this.router.navigate(['/404']);
    }
    return true;
  }

}
