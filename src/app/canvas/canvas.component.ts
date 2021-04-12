import { Component, OnInit, HostListener } from '@angular/core';
import { fabric } from 'fabric';
import { FileUploaderService } from '../file-uploader.service';
import { StorageService } from '../storage.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})

export class CanvasComponent implements OnInit {

  canvas?: fabric.Canvas;

  // some stroke options.
  strokeWidth = 20;
  strokeColor = '#005E7A';

  // If it's saving to db.
  numberOfSavesToDB = 0;

  // loading Screen
  showOverlay = true;

  freeHandDrawing = false;

  constructor(private storage: StorageService, private fileUploader: FileUploaderService) { }
  ngOnInit(): void {
    // Initialize the canvas
    this.canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'hand',
      selection: true,
      backgroundColor: '#F0F8FF',
      selectionBorderColor: 'blue',
      defaultCursor: 'hand',
      isDrawingMode: this.freeHandDrawing // As default, But can be toggled by the user.
    });

    this.canvas.setWidth(document.body.offsetWidth);
    this.canvas.setHeight(window.innerHeight);

    // If there's a saved Canvas, then it would be loaded.
    this.loadToCanvas();

    // Save each path being created to the db
    this.canvas.on('path:created', () => {
      this.save();
    });

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

  save(): void {
    if (!this.canvas) {
      return;
    }
    this.numberOfSavesToDB++;
    console.log('Saving Your file');
    const savePromise = this.storage.saveCanvasForUser(JSON.stringify(this.canvas.toJSON()));
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
    this.storage.loadByUserID().pipe(first()).subscribe(data => {
      if (this.canvas && data) {
        this.canvas.loadFromJSON(data.canvas, this.canvas.renderAll.bind(this.canvas));
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
      this.canvas.remove(...this.canvas.getObjects());
      console.log(this.canvas._objects.length);
      this.save();
    }
  }

    remove(): void {
      if (!this.canvas) {
        return;
      }
      this.canvas.remove(...this.canvas.getActiveObjects());
      this.canvas.discardActiveObject();
      this.save();
    }
}
