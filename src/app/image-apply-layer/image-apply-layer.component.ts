import { Component, ElementRef, ViewChild } from "@angular/core"
import { Color } from "./types/Color"
import { InputDataType, Pixel } from "./types/InputData"

@Component({
  selector: "app-image-apply-layer",
  templateUrl: "./image-apply-layer.component.html",
  styleUrl: "./image-apply-layer.component.scss",
})
export class ImageApplyLayerComponent {
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

  layers: ImageData[] = []

  opacityPercent: number

  constructor() {
    this.imageToShow = new Image()
    this.opacityPercent = 100
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

  onClick(event: MouseEvent) {
    const x = event.offsetX
    const y = event.offsetY

    let pixelInfo = ""
    this.layers.forEach((layer, index) => {
      const pixelIndex = (y * layer.width + x) * 4
      const red = layer.data[pixelIndex]
      const green = layer.data[pixelIndex + 1]
      const blue = layer.data[pixelIndex + 2]
      const alpha = layer.data[pixelIndex + 3]
      pixelInfo += `Layer ${index + 1}: RGB(${red}, ${green}, ${blue}), Alpha: ${alpha}\n`
    })

    console.log(`Pixel Info:\nX: ${x}, Y: ${y}\n${pixelInfo}`)
  }

  async changeRange(target: any) {
    this.opacityPercent = target.value
    await this.applyLayer()
    console.log("opacity percent: ", this.opacityPercent)
  }

  async applyLayer() {
    this.layers = []
    var canvas = document.createElement("canvas")
    canvas.width = this.imageRef.nativeElement.naturalWidth
    canvas.height = this.imageRef.nativeElement.naturalHeight
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.drawImage(this.imageRef.nativeElement, 0, 0, canvas.width, canvas.height)
      let originalData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      this.layers.push(originalData)

      // Tạo một bản sao của imageData trước khi thay đổi
      let updatedImageData = new ImageData(
        new Uint8ClampedArray(originalData.data),
        originalData.width,
        originalData.height
      )

      const inputData = this.generateInputArray(this.selectedColor, originalData.width, originalData.height)

      updatedImageData = this.updatePixelColor(updatedImageData, inputData)

      ctx.putImageData(updatedImageData, 0, 0)
      this.imageToShow.src = canvas.toDataURL("image/jpeg")

      this.layers.push(updatedImageData)
    }
  }

  updatePixelColor(imageData: ImageData, inputData: InputDataType): ImageData {
    const { color, pixels } = inputData
    for (const pixel of pixels) {
      if (pixel.x < 0 || pixel.x >= imageData.width || pixel.y < 0 || pixel.y >= imageData.height) {
        console.error("Coordinates out of bounds.")
        throw Error()
      }

      const alpha = this.opacityPercent / 100

      const index = (pixel.y * imageData.width + pixel.x) * 4

      // Original color of the pixel
      const originalRed = imageData.data[index]
      const originalGreen = imageData.data[index + 1]
      const originalBlue = imageData.data[index + 2]
      const originalAlpha = imageData.data[index + 3] / 255 // Convert alpha to range 0 to 1

      // New color with opacity
      const newRed = Math.round(originalRed * (1 - alpha) + this.colorRBG[color].r * alpha)
      const newGreen = Math.round(originalGreen * (1 - alpha) + this.colorRBG[color].g * alpha)
      const newBlue = Math.round(originalBlue * (1 - alpha) + this.colorRBG[color].b * alpha)
      const newAlpha = Math.round((originalAlpha + alpha - originalAlpha * alpha) * 255)

      // Update pixel color and opacity
      imageData.data[index] = newRed // Red channel
      imageData.data[index + 1] = newGreen // Green channel
      imageData.data[index + 2] = newBlue // Blue channel
      imageData.data[index + 3] = newAlpha // Alpha (opacity)
    }

    return imageData
  }

  generateInputArray(color: Color, imgWidth: number, imgHeight: number): InputDataType {
    const coordinates: Pixel[] = this.drawCircleCoordinates(imgWidth, imgHeight)
    return { color, pixels: coordinates }
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

  async applyColor(color: Color) {
    if (this.selectedColor === color) return
    this.selectedColor = color
    await this.applyLayer()
  }
}
