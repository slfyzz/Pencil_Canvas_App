import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
  }

  login(): void {
    // if the login is successful, redirect to '/Canvas'
    this.authService.login('/canvas');
  }
}
