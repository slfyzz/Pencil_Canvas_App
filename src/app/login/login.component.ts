import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router, private db: StorageService) {}

  ngOnInit(): void {
  }

  login(): void {
    // if the login is successful, redirect to '/dashboard'
    this.authService.login((user) => {
      if (user) {
        this.db.saveUserIDByEmail(user.email || '', user.uid);
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
