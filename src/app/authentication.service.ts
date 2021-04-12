import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private auth: AngularFireAuth, private router: Router) { }
  login(directTo: string): void {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(result => {
      localStorage.setItem('user', JSON.stringify(result.user));
      this.router.navigate([directTo]);
    }).catch(error => {
      localStorage.removeItem('user');
      console.error(error);
    });
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('user') !== null;
  }

  getUserUID(): string | null{
    const user = localStorage.getItem('user');
    if (!user) {
      return null;
    }
    return JSON.parse(user).uid;
  }

  onAuthStateChanged(checkAuthCallBack: (user: firebase.User | null) => void): void {
     firebase.auth().onAuthStateChanged(user => {
      checkAuthCallBack(user);
     });
  }

  logout(afterLogOutCallBack: (n: void) => void): void {
    this.auth.signOut().then(afterLogOutCallBack);
    localStorage.removeItem('user');
  }
}
