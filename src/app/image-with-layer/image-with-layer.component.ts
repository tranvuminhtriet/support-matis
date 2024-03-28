import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core"
import { MockedInputType } from "./types/MockedInputType"

@Component({
  selector: "app-image-with-layer",
  templateUrl: "./image-with-layer.component.html",
  styleUrl: "./image-with-layer.component.scss",
})
export class ImageWithLayerComponent implements AfterViewInit {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>

  inputData: MockedInputType = [
    { colorName: "i1", colorHex: "#aa0e26", src: "/assets/i1.png" },
    { colorName: "i2", colorHex: "#f80e80", src: "/assets/i2.png" },
    { colorName: "i3", colorHex: "#3434ff", src: "/assets/i3.png" },
  ]

  ngAfterViewInit(): void {
    const newImg = new Image()
    newImg.src = this.inputData[0].src
    this.canvasRef.nativeElement.width = newImg.width
    this.canvasRef.nativeElement.height = newImg.height
    newImg.src = this.inputData[1].src
    newImg.src = this.inputData[2].src
  }

  drawLayer(n?: string) {
    let context = this.canvasRef.nativeElement.getContext("2d")
    if (context) {
      const newImg = new Image()
      switch (n) {
        case "i1":
          newImg.src = this.inputData[0].src
          break
        case "i2":
          newImg.src = this.inputData[1].src
          break
        case "i3":
          newImg.src = this.inputData[2].src
          break
        default:
          break
      }
      context.drawImage(newImg, 0, 0)
    }
  }
}
