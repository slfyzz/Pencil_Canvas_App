import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {
  constructor() { }

  /**
   * Load Image as a file, which is uploaded from local storage, to Canvas and if it's done successfully we can perform a callback function.
   * @param img Image file from file input html element.
   * @param canvas fabric Canvas Object.
   * @param AfterAddingImgCallBack Callback function if img loading is done successfully.
   */
  loadImgToCanvas(img: File, canvas: fabric.Canvas | undefined, AfterAddingImgCallBack: (n: void) => void): void {
    const reader = new FileReader();
    reader.onload =  (event) => {
      if (event === null || event.target === null || event.target.result === null) {
        return;
      }
      const imgObj = new Image();
      imgObj.src = event.target.result as string;
      imgObj.onload =  () => {
          // start fabricJS part.
          const image = new fabric.Image(imgObj);
          image.set({
              left: 20,
              top: 20,
              padding: 10,
          });
          if (canvas) {
            canvas.add(image);
            AfterAddingImgCallBack();
          }
          // end fabricJS part
       };
    };
    reader.readAsDataURL(img);
  }
}
