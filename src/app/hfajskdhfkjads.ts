import { Component, ElementRef, ViewChild } from '@angular/core';
import { Color } from './types/Color';
import { Pixel } from './types/InputData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('imageRef') imageRef!: ElementRef<HTMLImageElement>;

  selectedColor: Color = 'red';

  colorRGB = {
    yellow: { r: 255, g: 255, b: 0 },
    red: { r: 255, g: 0, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    green: { r: 0, g: 255, b: 0 },
  };

  inputImgSrc = '/assets/IMG_vis.jpeg';

  imageToShow: HTMLImageElement = new Image();
  layers: ImageData[] = []; // Lưu trữ các layer
  layerInfos: any[] = []; // Lưu trữ thông tin về các layer

  constructor() {}

  onImageLoad(): void {
    console.log('Image loaded successfully!');
    this.imageToShow.src = this.inputImgSrc;
  }

  applyLayer(): void {
    const canvas = document.createElement('canvas');
    const img = this.imageRef.nativeElement;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const newLayer = new ImageData(canvas.width, canvas.height);
      this.drawCircleOnLayer(
        newLayer,
        this.selectedColor,
        canvas.width,
        canvas.height
      );
      this.layers.push(newLayer);

      const newLayerInfo = {
        type: 'circle',
        color: this.selectedColor,
      };
      this.layerInfos.push(newLayerInfo);

      this.applyAllLayers();
    }
  }

  applyAllLayers(): void {
    const canvas = document.createElement('canvas');
    const img = this.imageRef.nativeElement;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      this.layers.forEach(layer => {
        ctx.putImageData(layer, 0, 0);
      });
      this.imageToShow.src = canvas.toDataURL('image/jpeg');
    }
  }

  onClick(event: MouseEvent): void {
    const x = event.offsetX;
    const y = event.offsetY;

    const clickedLayerIndex = this.getClickedLayerIndex(x, y);
    if (clickedLayerIndex !== -1) {
      const clickedLayerInfo = this.layerInfos[clickedLayerIndex];
      console.log('Layer clicked:', clickedLayerInfo);
    } else {
      console.log('No layer clicked.');
    }
  }

  getClickedLayerIndex(x: number, y: number): number {
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i];
      const pixelIndex = (y * layer.width + x) * 4;
      const isTransparent = layer.data[pixelIndex + 3] === 0;
      if (!isTransparent) {
        return i;
      }
    }
    return -1;
  }

  drawCircleOnLayer(
    layer: ImageData,
    color: string,
    width: number,
    height: number
  ): void {
    const coordinates = this.drawCircleCoordinates(width, height);
    for (const pixel of coordinates) {
      this.updatePixelColor(layer, pixel.x, pixel.y, color);
    }
  }

  drawCircleCoordinates(width: number, height: number): Pixel[] {
    const cloudRadius = Math.min(width, height) * 0.4;
    const cloudCenterX = width / 2;
    const cloudCenterY = height / 2;
    const coordinates: Pixel[] = [];

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

  updatePixelColor(
    imageData: ImageData,
    x: number,
    y: number,
    color: string
  ): void {
    if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
      console.error('Coordinates out of bounds.');
      return;
    }

    const index = (y * imageData.width + x) * 4;
    const colorRGB = this.colorRGB[color as Color];
    imageData.data[index] = colorRGB.r;
    imageData.data[index + 1] = colorRGB.g;
    imageData.data[index + 2] = colorRGB.b;
    imageData.data[index + 3] = 255;
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
