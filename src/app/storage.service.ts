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


  /**
   * Save Canvas to  firebase real-time database in the path: "/users/:userID/Canvas/:canvasID",
   * it's used to sync Canvas object in CanvasComponent into user profile in db.
   * @param canvasJson JSON string of the Canvas.
   * @param canvasID ID of the Canvas.
   * @returns return a promise to determine what to do then After updating The canvas or NULL if user is not Authenticated.
   */
  saveCanvasForUser(canvasJson: string, canvasID: string): Promise<void> | null {

    // get the user ID.
    const userUID = this.auth.getUserUID();
    if (!userUID) {
      return null;
    }
    // update the user profile by the new Canvas.
    return this.db.object('/users/' + userUID + '/Canvas/' + canvasID).set(
      canvasJson
    );
  }

  /**
   * To keep track of signed Users' UID.
   * @param email Email of the user to Save.
   * @param UserID User ID associated with his email(Google Email as it's only supported way).
   * @returns return a promise to determine what to do then After Inserting the new Email.
   */
  saveUserIDByEmail(email: string, UserID: string): Promise<void> {
    return this.db.object('/users/emails/' + email.split('@')[0]).set(UserID);
  }

  /**
   * Get the Canvas Associated with the UserID profile from firebase db.
   * @param UserID User ID to Address user profile.
   * @param canvasID Canvas ID to track valueChanges.
   * @returns Observable.
   */
  loadCanvasByUserID(UserID: string, canvasID: string): Observable<any> {
    return this.db.object('/users/' + UserID + '/Canvas/' + canvasID).valueChanges();
  }

  /**
   * Get Shared Canvases with the User whose id is UserID.
   * @param userID User id.
   * @returns Observable.
   */
  getSharedCanvas(userID: string): Observable<any> {
    return this.db.list('/users/' + userID + '/sharedCanvas').valueChanges();
  }

  /**
   * Add a new "Canvas Info" Object to the list of Owned Canvases in db.
   * @param userID Id of the owner of the Canvas
   * @param canvasInfoObj Object contains Information of the Canvas {id: string, userID: string, name: string, userName: string}
   */
  addOwnedCanvas(userID: string, canvasInfoObj: any): void {
    firebase.database().ref('/users/' + userID + '/ownedCanvas/' + canvasInfoObj.id).set(canvasInfoObj);
  }
  /**
   * Get Owned Canvases with the User whose id is UserID.
   * @param userID User id.
   * @returns Observable.
   */
  getOwnedCanvas(userID: string): Observable<any> {
    return this.db.list('/users/' + userID + '/ownedCanvas').valueChanges();
  }

  /**
   * Add a new "Canvas Info" Object to the list of Owned Canvases in db.
   * @param email Email of the owner of the Canvas
   * @param canvasInfoObj Object contains Information of the Canvas {id: string(id of the canvas), to: string(email),
   *                                                  from: string(email of the Owner), userID: string(id of the Owner)}
   */
  addShareCanvasByEmail(email: string, canvasInfoObj: any): void {

    // first We need to fetch the Owner ID.
    this.db.object('/users/emails/' + email.split('@')[0]).valueChanges().subscribe((data) => {
      // if there's a User with this Email Signed before.
      if (data) {
        firebase.database().ref('/users/' + data + '/sharedCanvas/' + canvasInfoObj.userID + canvasInfoObj.id).set(canvasInfoObj);
      } else {
        // otherwise, for now just print to the console.
        console.error('User is not in the system');
      }
    });
  }
}

