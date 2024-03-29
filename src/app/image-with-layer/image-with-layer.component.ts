import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import { MockedInputType } from "./types/MockedInputType"

@Component({
  selector: "app-image-with-layer",
  templateUrl: "./image-with-layer.component.html",
  styleUrl: "./image-with-layer.component.scss",
})
export class ImageWithLayerComponent implements AfterViewInit {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>

  layers: { colorName?: string; opacity: number; image: HTMLImageElement }[] = []
  selectedColor = []

  inputData: MockedInputType = [
    { colorName: "i1", colorHex: "#a90c22", src: "/assets/i1.png" },
    { colorName: "i2", colorHex: "#fa99ff", src: "/assets/i2.png" },
    { colorName: "i3", colorHex: "#c86477", src: "/assets/i3.png" },
    { colorName: "i4", colorHex: "#3333ff", src: "/assets/i4.png" },
    { colorName: "i5", colorHex: "#6464ff", src: "/assets/i5.png" },
    { colorName: "i6", colorHex: "#fa9934", src: "/assets/i6.png" },
    { colorName: "i7", colorHex: "#073300", src: "/assets/i7.png" },
    { colorName: "i8", colorHex: "#36cc00", src: "/assets/i8.png" },
    { colorName: "i9", colorHex: "#280128", src: "/assets/i9.png" },
    { colorName: "i10", colorHex: "#cccc01", src: "/assets/i10.png" },
    { colorName: "i11", colorHex: "#0113cc", src: "/assets/i11.png" },
    { colorName: "i12", colorHex: "#f80e7f", src: "/assets/i12.png" },
    { colorName: "i13", colorHex: "#990200", src: "/assets/i13.png" },
    { colorName: "i14", colorHex: "#000566", src: "/assets/i14.png" },
    { colorName: "i15", colorHex: "#282828", src: "/assets/i15.png" },
  ]

  ngAfterViewInit(): void {
    this.generateCanvasSize()
  }

  generateCanvasSize() {
    const canvas = this.canvasRef.nativeElement
    const image = new Image()
    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height
    }
    image.src = this.inputData[0].src
  }

  drawLayer(i: number) {
    const canvas = this.canvasRef.nativeElement
    const context = canvas.getContext("2d")
    if (context) {
      const newImg = new Image()
      newImg.src = this.inputData[i].src
      newImg.onload = () => {
        this.layers.push({ colorName: this.inputData[i].colorName, image: newImg, opacity: 1 })
        this.drawAllLayers()
      }
    }
  }

  layerExists(colorName?: string) {
    return this.layers.some((layer) => layer.colorName === colorName)
  }

  removeLayer(colorName?: string) {
    const index = this.layers.findIndex((layer) => layer.colorName === colorName)
    if (index !== -1) {
      this.layers.splice(index, 1)
      this.drawAllLayers()
    }
  }

  getOpacity(colorName?: string): number {
    const layer = this.layers.find((layer) => layer.colorName === colorName)
    return layer ? layer.opacity : 1 // default opacity is 1
  }

  updateOpacity(opacity: string, colorName?: string): void {
    const layerIndex = this.layers.findIndex((layer) => layer.colorName === colorName)
    if (layerIndex !== -1) {
      this.layers[layerIndex].opacity = parseFloat(opacity)
      this.drawAllLayers()
    }
  }

  drawAllLayers() {
    const canvas = this.canvasRef.nativeElement
    const context = canvas.getContext("2d")
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      for (const layer of this.layers) {
        context.globalAlpha = layer.opacity // Set opacity for each layer
        context.drawImage(layer.image, 0, 0)
      }
    }
  }
}
