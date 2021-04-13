import { Component, OnInit } from '@angular/core';

import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { CanvasesService } from './canvases.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Canvas';
  showOverlay = true;
  canvasName = '';

  constructor(public auth: AuthenticationService, private router: Router, private canvasService: CanvasesService) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit(): void {
  }

  navigationInterceptor(event: RouterEvent): void {

    if (event instanceof NavigationStart) {
      this.showOverlay = true;
    }
    if (event instanceof NavigationEnd) {
      this.showOverlay = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.showOverlay = false;
    }
    if (event instanceof NavigationError) {
      this.showOverlay = false;
    }
  }

  logout(): void {
    // after Log out, the view should be the login Page.
    this.auth.logout(() => {
      this.router.navigate(['/login']);
    });
  }

  createCanvas(event: any): void{
    console.log(event);
    const user = this.auth.getCurrentUser();
    if (user) {
      const canvasID = this.canvasService.createCanvas(user.uid, user.displayName || user.email || user.uid, this.canvasName);
      this.canvasName = '';
      this.router.navigate(['/canvas/' + user.uid + '/' + canvasID]);
    }
  }
}
