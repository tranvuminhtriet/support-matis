import { Component, ElementRef, ViewChild } from "@angular/core"
import { InputDataType, Pixel } from "./types/InputData"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  @ViewChild("imageRef") imageRef!: ElementRef<any>

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

  applyLayer(e: any) {
    var canvas = document.createElement("canvas")
    canvas.width = this.imageRef.nativeElement.naturalWidth
    canvas.height = this.imageRef.nativeElement.naturalHeight
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.drawImage(this.imageRef.nativeElement, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      const inputData = this.generateInputArray(6000000, "yellow", imageData.width, imageData.height)
      for (let i = 0; i < inputData.pixels.length; i++) {
        // yellow: 255, 255, 0
        this.updatePixelColor(imageData, inputData.pixels[i].x, inputData.pixels[i].y, 255, 255, 0)
      }

      ctx.putImageData(imageData, 0, 0)
      this.imageToShow.src = canvas.toDataURL("image/jpeg")
    }
  }

  generateFlowerinatesWithinImage(radius: number, imageWidth: number, imageHeight: number): Pixel[] {
    const numPetals = 8
    const angleIncrement = (2 * Math.PI) / numPetals

    const centerX = imageWidth / 2
    const centerY = imageHeight / 2

    const coordinates: Pixel[] = []

    for (let i = 0; i < numPetals; i++) {
      const angle = i * angleIncrement
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      coordinates.push({ x, y })
    }

    return coordinates
  }

  generateInputArray(
    numItems: number,
    color: "red" | "blue" | "green" | "yellow",
    imgWidth: number,
    imgHeight: number
  ): InputDataType {
    const coordinates: Pixel[] = []
    for (let i = 0; i < numItems; i++) {
      const x = Math.floor(Math.random() * imgWidth)
      const y = Math.floor(Math.random() * imgHeight)
      coordinates.push({ x, y })
    }
    return { color, pixels: coordinates }
  }

  updatePixelColor(imageData: ImageData, x: number, y: number, red: number, green: number, blue: number): void {
    // Ensure coordinates are within bounds
    if (x < 0 || x > imageData.width || y < 0 || y > imageData.height) {
      console.error("Coordinates out of bounds.")
      return
    }
    // Calculate the index of the pixel in the array
    const index = (y * imageData.width + x) * 4
    // Update pixel color
    imageData.data[index] = red // Red channel
    imageData.data[index + 1] = green // Green channel
    imageData.data[index + 2] = blue // Blue channel
  }
}
