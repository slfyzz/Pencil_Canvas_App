import { Component, OnInit, HostListener } from '@angular/core';
import { fabric } from 'fabric';
import { FileUploaderService } from '../file-uploader.service';
import { StorageService } from '../storage.service';
import { AuthenticationService } from '../authentication.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})

export class CanvasComponent implements OnInit {

  canvas?: fabric.Canvas;

  // any random value for now.
  canvasID = new Date().toString();

  // it's bind with share field, to get the Email input from user.
  shareTo = '';

  // some stroke options.
  strokeWidth = 20;
  strokeColor = '#005E7A';

  // To keep track of number of save requests, to keep 'loading spinner' working until numberOfSaves be 0 again.
  numberOfSavesToDB = 0;

  // loading Screen
  showOverlay = true;

  freeHandDrawing = false;

  // if it's read-only canvas, it must be false.
  editable = false;

  constructor(private storage: StorageService,
              private fileUploader: FileUploaderService,
              private auth: AuthenticationService,
              private route: ActivatedRoute) { }
  ngOnInit(): void {

    // if it's the owner of the Canvas, then it's editable.
    this.editable = this.auth.getUserUID() === this.route.snapshot.paramMap.get('userID');

    // Initialize the canvas
    this.canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'hand',
      selection: this.editable,
      backgroundColor: '#F0F8FF',
      selectionBorderColor: 'blue',
      defaultCursor: 'hand',
      isDrawingMode: this.editable && this.freeHandDrawing
    });

    // set width and height.
    this.canvas.setWidth(document.body.offsetWidth);
    this.canvas.setHeight(window.innerHeight);

    // get Canvas ID from URL
    this.canvasID = this.route.snapshot.paramMap.get('canvasID') || this.canvasID;

    // If there's a saved Canvas, then it would be loaded.
    this.loadToCanvas();

    // Save each path being created to the db
    this.canvas.on('path:created', () => {
      this.save();
    });

    // Save each Object being modified to the db
    this.canvas.on('object:modified', () => {
      this.save();
    });

    // update stoke color and width with the default values.
    this.updateStrokeWidth();
    this.updateStrokeColor();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (this.canvas) {
      this.canvas.setWidth(event.target.innerWidth);
      this.canvas.setHeight(event.target.innerHeight);
    }
  }

  /**
   * Send 'THE WHOLE CANVAS' to db to be Stored as JSON string.
   */
  save(): void {
    if (!this.canvas) {
      return;
    }
    // request is happening.
    this.numberOfSavesToDB++;
    console.log('Saving Your file');

    const savePromise = this.storage.saveCanvasForUser(JSON.stringify(this.canvas.toJSON()), this.canvasID);
    if (savePromise) {
      savePromise.then(() => {
        this.numberOfSavesToDB--;
        console.log('Your drawing is on Cloud :)');
      }).catch((error) => {
        this.numberOfSavesToDB--;
        console.error('Can\'t preform AutoSaving', error);
      });
    }
  }

  toggleFreeHandDrawing(): void {
    if (this.canvas) {
      this.freeHandDrawing = !this.freeHandDrawing;
      this.canvas.isDrawingMode = this.freeHandDrawing;
    }
  }

  /**
   * Update the stroke Width of the canvas By the value chosen by the user as input.
   * @returns void
   */
  updateStrokeWidth(): void {
    // if it's get called by mistake before initializing the canvas.
    if (!this.canvas) {return; }
    this.canvas.freeDrawingBrush.width = this.strokeWidth;
  }

  /**
   * Update the stroke Color of the canvas By the value chosen by the user as input.
   * @returns void
   */
  updateStrokeColor(): void {
    // if it's get called by mistake before initializing the canvas.
    if (!this.canvas) {return; }
    this.canvas.freeDrawingBrush.color = this.strokeColor;
  }

  /**
   * Called to load the The saved Canvas from database.
   * @returns Void
   */
  loadToCanvas(): void {

    const userID = this.route.snapshot.paramMap.get('userID');
    if (!userID) { return; }

    this.storage.loadCanvasByUserID(userID, this.canvasID).pipe(first()).subscribe(canvas => {
      if (this.canvas && canvas) {
        this.canvas.loadFromJSON(canvas, this.canvas.renderAll.bind(this.canvas));
      }
      this.showOverlay = false;
    });
  }
  /**
   * Called when the user select a photo to be inserted to the Canvas.
   * @returns void
   */
  onFileSelected(e: any): void {
    // after adding the Image we need to Save it to database.
    this.fileUploader.loadImgToCanvas(e.target.files[0], this.canvas, () => {
      this.save();
    });
  }

  clear(): void {
    if (this.canvas) {
      // clear all Objects in canvas and save the changes.
      this.canvas.remove(...this.canvas.getObjects());
      this.save();
    }
  }

    remove(): void {
      if (!this.canvas) {
        return;
      }
      // remove the selected object the save the changes.
      this.canvas.remove(...this.canvas.getActiveObjects());
      this.canvas.discardActiveObject();
      this.save();
    }

    /**
     * Share the current Canvas with the specified Email in shareTo.
     * If 'shareTo' is not a user in the system then it would be a lost signal,
     * which means that the user will need to reshare it again after logging in with the email specified in shareTo.
     * Note: Currently it doesn't give a user a proper feedback if the share is lost or not.
     */
    share(): void {
      this.storage.addShareCanvasByEmail(this.shareTo, {
        id: this.canvasID,
        to: this.shareTo,
        from: this.auth.getCurrentUser()?.email,
        userID: this.route.snapshot.paramMap.get('userID')
      });
    }
}

