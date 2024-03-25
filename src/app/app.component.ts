import { Component, ElementRef, ViewChild } from "@angular/core"
import { InputDataType, Pixel } from "./types/InputData"
import { Color } from "./types/Color"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  @ViewChild("imageRef") imageRef!: ElementRef<any>

  selectedColor: Color = "red"

  colorRBG = {
    yellow: { r: 255, g: 255, b: 0 },
    red: { r: 255, g: 0, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    green: { r: 0, g: 255, b: 0 },
  }

  inputImgSrc = "/assets/IMG_vis.jpeg"

  imageToShow

  constructor() {
    this.imageToShow = new Image()
  }

  onImageLoad(): void {
    console.log("Image loaded successfully!")
  }

  scaleImage(canvas: HTMLCanvasElement) {
    const sizeW = 800 // HD 1920x1080
    const sizeH = 600 // HD 1920x1080

    const scaleFactor = this.imageRef.nativeElement.width / this.imageRef.nativeElement.height
    // Set actual size in memory (scaled to account for extra pixel density).
    if (scaleFactor >= 1) {
      // width >= height
      canvas.width = Math.floor(
        this.imageRef.nativeElement.width > sizeW ? sizeW : this.imageRef.nativeElement.naturalWidth
      )
      canvas.height = Math.floor(
        this.imageRef.nativeElement.width > sizeW ? sizeW / scaleFactor : this.imageRef.nativeElement.naturalHeight
      )
    } else {
      // width < height
      canvas.width = Math.floor(
        this.imageRef.nativeElement.height > sizeH ? sizeH * scaleFactor : this.imageRef.nativeElement.naturalWidth
      )
      canvas.height = Math.floor(
        this.imageRef.nativeElement.height > sizeH ? sizeH : this.imageRef.nativeElement.naturalHeight
      )
    }
    return canvas
  }

  applyLayer() {
    var canvas = document.createElement("canvas")
    canvas.width = this.imageRef.nativeElement.naturalWidth
    canvas.height = this.imageRef.nativeElement.naturalHeight
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.drawImage(this.imageRef.nativeElement, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      const inputData = this.generateInputArray(this.selectedColor, imageData.width, imageData.height)
      for (let i = 0; i < inputData.pixels.length; i++) {
        this.updatePixelColor(imageData, inputData.pixels[i].x, inputData.pixels[i].y, inputData.color)
      }

      ctx.putImageData(imageData, 0, 0)
      this.imageToShow.src = canvas.toDataURL("image/jpeg")
    }
  }

  generateInputArray(color: Color, imgWidth: number, imgHeight: number): InputDataType {
    const coordinates: Pixel[] = this.drawCircleCoordinates(imgWidth, imgHeight)
    return { color, pixels: coordinates }
  }

  updatePixelColor(imageData: ImageData, x: number, y: number, color: Color): void {
    // Ensure coordinates are within bounds
    if (x < 0 || x > imageData.width || y < 0 || y > imageData.height) {
      console.error("Coordinates out of bounds.")
      return
    }
    // Calculate the index of the pixel in the array
    const index = (y * imageData.width + x) * 4
    // Update pixel color
    imageData.data[index] = this.colorRBG[color].r // Red channel
    imageData.data[index + 1] = this.colorRBG[color].g // Green channel
    imageData.data[index + 2] = this.colorRBG[color].b // Blue channel
  }

  drawCircleCoordinates(width: number, height: number) {
    const cloudRadius = Math.min(width, height) * 0.4
    const cloudCenterX = width / 2
    const cloudCenterY = height / 2
    const coordinates = []
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = cloudCenterX - x
        const dy = cloudCenterY - y
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy)
        if (distanceFromCenter <= cloudRadius) {
          coordinates.push({ x, y })
        }
      }
    }
    return coordinates
  }

  applyColor(color: Color) {
    if (this.selectedColor === color) return
    this.selectedColor = color
    this.applyLayer()
  }
}
