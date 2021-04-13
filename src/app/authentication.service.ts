import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService{

  constructor(private auth: AngularFireAuth, private router: Router) { }

  private logger = new Subject<boolean>();

  /**
   * Login via their google account, and store it in local storage (our cache).
   */
  login(callBackIfSuccess: (n: firebase.User | null) => void): void {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(result => {
      localStorage.setItem('user', JSON.stringify(result.user));
      this.logger.next(true);
      callBackIfSuccess(result.user);
    }).catch(error => {
      localStorage.removeItem('user');
      console.error(error);
    });
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  getUserUID(): string | null{
    const user = this.getCurrentUser();
    return user ? user.uid : null;
  }

  /**
   * return an Observable if user log in or sign out.
   */
  getObservableOfUserID(): Observable<any> {
    return this.logger.asObservable();
  }

  onAuthStateChanged(checkAuthCallBack: (user: firebase.User | null) => void): void {
     firebase.auth().onAuthStateChanged(user => {
      checkAuthCallBack(user);
     });
  }

  logout(afterLogOutCallBack: (n: void) => void): void {
    this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.logger.next(false);
      afterLogOutCallBack();
    });
  }

  /**
   * First look at local Storage, if found return it. otherwise look for it in firebase.auth().
   */
  getCurrentUser(): firebase.User | null {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user) as firebase.User;
    }
    const firebaseUser = firebase.auth().currentUser;
    if (firebaseUser) {
      localStorage.setItem('user', JSON.stringify(firebaseUser));
    }
    return firebaseUser;
  }
}
