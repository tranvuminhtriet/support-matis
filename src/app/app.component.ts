import { Component, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { InputDataType, Pixel } from './types/InputData';
import { Color } from './types/Color';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('imageRef') imageRef!: ElementRef<any>;

  selectedColor: Color = 'red';

  colorRBG = {
    yellow: { r: 255, g: 255, b: 0 },
    red: { r: 255, g: 0, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    green: { r: 0, g: 255, b: 0 },
  };

  inputImgSrc = '/assets/IMG_vis.jpeg';

  imageToShow;

  layers: ImageData[] = [];

  opacityPercent: number;

  constructor() {
    this.imageToShow = new Image();
    this.opacityPercent = 50;
  }

  onImageLoad(): void {
    console.log('Image loaded successfully!');
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

  onClick(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;

    let pixelInfo = '';
    this.layers.forEach((layer, index) => {
      const pixelIndex = (y * layer.width + x) * 4;
      const red = layer.data[pixelIndex];
      const green = layer.data[pixelIndex + 1];
      const blue = layer.data[pixelIndex + 2];
      const alpha = layer.data[pixelIndex + 3];
      pixelInfo += `Layer ${index + 1}: RGB(${red}, ${green}, ${blue}), Alpha: ${alpha}\n`;
    });

    console.log(`Pixel Info:\nX: ${x}, Y: ${y}\n${pixelInfo}`);
  }

  changeRange(target: any) {
    this.opacityPercent = target.value;
    this.applyLayer();
  }

  applyLayer() {
    this.layers = [];
    var canvas = document.createElement('canvas');
    canvas.width = this.imageRef.nativeElement.naturalWidth;
    canvas.height = this.imageRef.nativeElement.naturalHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        this.imageRef.nativeElement,
        0,
        0,
        canvas.width,
        canvas.height
      );
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.layers.push(imageData);
      const inputData = this.generateInputArray(
        this.selectedColor,
        imageData.width,
        imageData.height
      );
      for (let i = 0; i < inputData.pixels.length; i++) {
        this.updatePixelColor(
          imageData,
          inputData.pixels[i].x,
          inputData.pixels[i].y,
          inputData.color,
          this.opacityPercent
        );
      }

      ctx.putImageData(imageData, 0, 0);
      this.imageToShow.src = canvas.toDataURL('image/jpeg');
      this.layers.push(imageData);
    }
  }

  generateInputArray(
    color: Color,
    imgWidth: number,
    imgHeight: number
  ): InputDataType {
    const coordinates: Pixel[] = this.drawCircleCoordinates(
      imgWidth,
      imgHeight
    );
    return { color, pixels: coordinates };
  }

  updatePixelColor(
    imageData: ImageData,
    x: number,
    y: number,
    color: Color,
    opacityPercent: number // Opacity in percentage (0 - 100)
  ): ImageData {
    if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
      console.error('Coordinates out of bounds.');
      throw Error();
    }

    const alpha = opacityPercent / 100;

    const index = (y * imageData.width + x) * 4;

    // Original color of the pixel
    const originalRed = imageData.data[index];
    const originalGreen = imageData.data[index + 1];
    const originalBlue = imageData.data[index + 2];
    const originalAlpha = imageData.data[index + 3] / 255; // Convert alpha to range 0 to 1

    // New color with opacity
    const newRed = Math.round(
      originalRed * (1 - alpha) + this.colorRBG[color].r * alpha
    );
    const newGreen = Math.round(
      originalGreen * (1 - alpha) + this.colorRBG[color].g * alpha
    );
    const newBlue = Math.round(
      originalBlue * (1 - alpha) + this.colorRBG[color].b * alpha
    );
    const newAlpha = Math.round(
      (originalAlpha + alpha - originalAlpha * alpha) * 255
    );

    // Update pixel color and opacity
    imageData.data[index] = newRed; // Red channel
    imageData.data[index + 1] = newGreen; // Green channel
    imageData.data[index + 2] = newBlue; // Blue channel
    imageData.data[index + 3] = newAlpha; // Alpha (opacity)

    return imageData;
  }

  drawCircleCoordinates(width: number, height: number) {
    const cloudRadius = Math.min(width, height) * 0.4;
    const cloudCenterX = width / 2;
    const cloudCenterY = height / 2;
    const coordinates = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = cloudCenterX - x;
        const dy = cloudCenterY - y;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
        if (distanceFromCenter <= cloudRadius) {
          coordinates.push({ x, y });
        }
      }
    }
    return coordinates;
  }

  applyRed() {
    if (this.selectedColor === 'red') return;
    this.selectedColor = 'red';

    this.applyLayer();
  }
  applyGreen() {
    if (this.selectedColor === 'green') return;
    this.selectedColor = 'green';
    this.applyLayer();
  }
  applyBlue() {
    if (this.selectedColor === 'blue') return;
    this.selectedColor = 'blue';
    this.applyLayer();
  }
  applyYellow() {
    if (this.selectedColor === 'yellow') return;
    this.selectedColor = 'yellow';
    this.applyLayer();
  }
}
