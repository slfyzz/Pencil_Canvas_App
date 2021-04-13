import { Injectable, OnDestroy } from '@angular/core';

import { AuthenticationService } from './authentication.service';
import { StorageService } from './storage.service';

import 'firebase/auth';

// some const values, instead of MAGIC strings.
const OWNED = 'ownedCanvas';
const SHARED = 'sharedCanvas';

@Injectable({
  providedIn: 'root'
})
export class CanvasesService implements OnDestroy{

  constructor(private auth: AuthenticationService, private db: StorageService) {

    // subscribe the event of signing in or out, to load or destroy user data stored in local storage (our cache).
    this.auth.getObservableOfUserID().subscribe((val) => {
      if (val) {
        const id = this.auth.getUserUID();
        if (id) {
          this.loadUserData(id);
        }
      }
      else {
        this.destroyUserData();
      }
    });
  }

  // to store subscription, to unsubscribe it later.
  userSub?: any;
  sharedSub?: any;

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private unsubscribe(): void {
    if (this.sharedSub) {
      this.sharedSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }


  /**
   * Sync all accessible Canvases, to the authenticated user, into local storage in two separate lists.
   */
  loadUserData(userID: string): void {
    this.userSub = this.db.getOwnedCanvas(userID).subscribe((data) => {
      localStorage.setItem(OWNED, JSON.stringify(data));
    });

    this.sharedSub = this.db.getSharedCanvas(userID).subscribe((data) => {
      localStorage.setItem(SHARED, JSON.stringify(data));
   });
  }

  private destroyUserData(): void {
    localStorage.removeItem(OWNED);
    localStorage.removeItem(SHARED);
    this.unsubscribe();

  }

  /**
   * Check if a canvas can be accessed by the user whose id is UserID.
   * @returns returns true if the canvas can be accessed, no otherwise.
   */
  canAccess(UserID: string, canvasID: string): boolean {
    if (!this.auth.isAuthenticated()) {
      return false;
    }
    const currentUserID = this.auth.getUserUID();
    if (currentUserID === UserID) {
      return this.searchInLocalLists(OWNED, UserID, canvasID);
    } else  {
      return this.searchInLocalLists(SHARED, UserID, canvasID);
    }
  }

  getSharedCanvases(): object[]{
    const canvases = localStorage.getItem(SHARED);
    if (canvases) {
      return JSON.parse(canvases) as object[];
    }
    return [];
  }

  getOwnedCanvases(): object[]{
    const canvases = localStorage.getItem(OWNED);
    if (canvases) {
      return JSON.parse(canvases) as object[];
    }
    return [];
  }

  /**
   * Create an entry in the Owned Canvas List with some information(userID, userName, canvasID, canvasName),
   * CanvasID would be assigned to canvasName if the user didn't specify a name.
   * @returns returns Canvas Name.
   */
  createCanvas(userID: string, userName: string, canvasName: string): string {

    // get the list of ownedCanvas from local storage (synced with the lists in db), or an empty list.
    const canvases = JSON.parse(localStorage.getItem(OWNED) || '[]') as {id: string,
                                                                        userID: string,
                                                                        name: string,
                                                                        userName: string}[];

    const canvasID = 'canvas_' + this.getID(canvases);
    canvases.push({
      id: canvasID,
      userID,
      name: canvasName || canvasID,
      userName
    });

    // add it to the remote db
    this.db.addOwnedCanvas(userID, canvases[canvases.length - 1]);
    return canvasID;
  }

  /**
   * Generate a trivial id by giving a number to each Canvas sequentially
   * EX: Canvas_0, Canvas_1,..
   * @returns Id generated for that canvas.
   */
  private getID(canvases: any): number {
    let id = canvases.length;
    if (id > 0) {
      id = this.getMaxID(canvases) + 1;
    }
    return id;
  }

  private getMaxID(canvases: any): number {
    return +(canvases.reduce((a: { id: string; }, b: { id: string; }) => {
      if ((+(a.id as string).split('_')[1]) >  (+(b.id as string).split('_')[1])) {
        return a;
      } else {
        return b;
      }
    }).id as string).split('_')[1];
  }

  /**
   * Search for a given CanvasId and userID in list stored in local storage with listName key.
   * @returns true if found in the given list, false otherwise.
   */
  private searchInLocalLists(listName: string, userID: string, canvasID: string): boolean {
    const canvasString = localStorage.getItem(listName);
    if (!canvasString) {
      return false;
    }
    const canvasList = JSON.parse(canvasString);

    return canvasList.find((canvas: { id: string; userID: string }) => {
      if (canvas.id && canvas.userID) {
        return canvas.id === canvasID && canvas.userID === userID;
      }
      return false;
    });
  }

}


