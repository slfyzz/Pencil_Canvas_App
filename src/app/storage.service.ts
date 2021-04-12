import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private db: AngularFireDatabase, private auth: AuthenticationService) { }

  saveCanvasForUser(canvasJson: string): Promise<void> | null {

    // get the user ID.
    const userUID = this.auth.getUserUID();
    if (!userUID) {
      return null;
    }
    // update the user profile by the new Canvas.
    return this.db.object('/users/' + userUID).update({
      canvas: canvasJson
    });
  }

  loadByUserID(): Observable<any> {
    const userUID = this.auth.getUserUID();
    return this.db.object('/users/' + userUID).valueChanges();
  }
}

