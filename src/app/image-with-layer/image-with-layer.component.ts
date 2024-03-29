import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core"
import CssFilterConverter from "css-filter-converter"

@Component({
  selector: "app-image-with-layer",
  templateUrl: "./image-with-layer.component.html",
  styleUrl: "./image-with-layer.component.scss",
})
export class ImageWithLayerComponent implements AfterViewInit {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>

  layers: {
    colorName?: string
    opacity: number
    image: HTMLImageElement
    filterColor?: string
  }[] = []

  onColorChange($event: any, colorName?: string) {
    console.log($event.target.value)
    const index = this.layers.findIndex((layer) => layer.colorName === colorName)
    const filter = this.generateFilter($event.target.value)
    this.layers[index].filterColor = filter.color ?? undefined
    this.drawAllLayers()
  }

  inputData = [
    { colorName: "i1", colorHex: "#a90c22", src: "/assets/i1.jpg" },
    { colorName: "i2", colorHex: "#fa99ff", src: "/assets/i2.jpg" },
    { colorName: "i3", colorHex: "#c86477", src: "/assets/i3.jpg" },
    { colorName: "i4", colorHex: "#3333ff", src: "/assets/i4.jpg" },
    { colorName: "i5", colorHex: "#6464ff", src: "/assets/i5.jpg" },
    { colorName: "i6", colorHex: "#fa9934", src: "/assets/i6.jpg" },
    { colorName: "i7", colorHex: "#073300", src: "/assets/i7.jpg" },
    { colorName: "i8", colorHex: "#36cc00", src: "/assets/i8.jpg" },
    { colorName: "i9", colorHex: "#280128", src: "/assets/i9.jpg" },
    { colorName: "i10", colorHex: "#cccc01", src: "/assets/i10.jpg" },
    { colorName: "i11", colorHex: "#0113cc", src: "/assets/i11.jpg" },
    { colorName: "i12", colorHex: "#f80e7f", src: "/assets/i12.jpg" },
    { colorName: "i13", colorHex: "#990200", src: "/assets/i13.jpg" },
    { colorName: "i14", colorHex: "#000566", src: "/assets/i14.jpg" },
    { colorName: "i15", colorHex: "#282828", src: "/assets/i15.jpg" },
    { colorName: "test", colorHex: "#fffff", src: "/assets/test.png" },
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
    this.generateFirstLayer("/assets/init.jpg")
  }

  generateFirstLayer(src?: string) {
    if (src) {
      const image = new Image()
      const canvas = this.canvasRef.nativeElement
      const context = canvas.getContext("2d")
      image.onload = () => {
        context?.drawImage(image, 0, 0)
      }
      image.src = src
      this.layers.push({ image: image, opacity: 1 })
    }
  }

  drawLayer(i: number) {
    const newImg = new Image()
    newImg.src = this.inputData[i].src
    newImg.onload = () => {
      this.layers.push({
        colorName: this.inputData[i].colorName,
        image: newImg,
        opacity: 1,
      })
      this.drawAllLayers()
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

  updateOpacity(event: any, colorName?: string): void {
    const layerIndex = this.layers.findIndex((layer) => layer.colorName === colorName)
    if (layerIndex !== -1 && !!event) {
      this.layers[layerIndex].opacity = parseFloat(event.target.value)
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

        // Adjust color
        if (layer.filterColor) {
          context.filter = layer.filterColor
        } else {
          context.filter = "none"
        }

        context.drawImage(layer.image, 0, 0)
      }
    }
  }

  generateFilter(hexColor: string) {
    return CssFilterConverter.hexToFilter(hexColor)
  }
}
