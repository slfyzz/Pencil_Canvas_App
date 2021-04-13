import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { AuthenticationService } from '../authentication.service';
import firebase from 'firebase';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanvasesService } from '../canvases.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input() user: firebase.User | undefined | null;
  UserCanvasObservable: Observable<any> | undefined;
  SharedCanvasObservable: Observable<any> | undefined;

  isEditEnable = true;

  constructor(public db: StorageService,
              public auth: AuthenticationService,
              public canvasService: CanvasesService,
              private router: Router) { }

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
    if (!this.user) {
      // if user is not authenticated.
      this.router.navigate(['login']);
    } else {
      // if user is authenticated, load user data in local storage.
      this.canvasService.loadUserData(this.user.uid);
      // then assign Observable to keep track of Owned and shared Canvas in HTML file using async pipe.
      this.UserCanvasObservable =  this.db.getOwnedCanvas(this.user.uid);
      this.SharedCanvasObservable = this.db.getSharedCanvas(this.user.uid);
    }
  }
}
