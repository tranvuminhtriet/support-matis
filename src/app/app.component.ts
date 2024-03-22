import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('imageRef') imageRef!: ElementRef<any>;

  inputImgSrc = '/assets/IMG_vis.jpeg';

  imgToShow: any;

  constructor() {}

  onImageLoad(): void {
    console.log('Image loaded successfully!');

    var canvas = document.createElement('canvas');
    canvas.width = this.imageRef.nativeElement.naturalWidth;
    canvas.height = this.imageRef.nativeElement.width;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(
        this.imageRef.nativeElement,
        0,
        0,
        canvas.width,
        canvas.height
      );
      const dataInputImage = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      console.log(dataInputImage);

      this.scaleImage(canvas);
      const scaledImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      console.log(scaledImage);
    }
  }

  scaleImage(canvas: HTMLCanvasElement) {
    const sizeW = 800; // HD 1920x1080
    const sizeH = 600; // HD 1920x1080

    const scaleFactor =
      this.imageRef.nativeElement.width / this.imageRef.nativeElement.height;
    // Set actual size in memory (scaled to account for extra pixel density).
    if (scaleFactor >= 1) {
      // width >= height
      canvas.width = Math.floor(
        this.imageRef.nativeElement.width > sizeW
          ? sizeW
          : this.imageRef.nativeElement.naturalWidth
      );
      canvas.height = Math.floor(
        this.imageRef.nativeElement.width > sizeW
          ? sizeW / scaleFactor
          : this.imageRef.nativeElement.naturalHeight
      );
    } else {
      // width < height
      canvas.width = Math.floor(
        this.imageRef.nativeElement.height > sizeH
          ? sizeH * scaleFactor
          : this.imageRef.nativeElement.naturalWidth
      );
      canvas.height = Math.floor(
        this.imageRef.nativeElement.height > sizeH
          ? sizeH
          : this.imageRef.nativeElement.naturalHeight
      );
    }
    return canvas;
  }

  applyLayer(e: any) {}
}
