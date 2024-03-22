import { Component, ElementRef, ViewChild } from "@angular/core"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  @ViewChild("imageRef") imageRef!: ElementRef<any>

  inputImgSrc = "/assets/IMG_vis.jpeg"

  imgToShow: any

  constructor() {}

  onImageLoad(): void {
    console.log("Image loaded successfully!")
    var canvas = document.createElement("canvas")
    canvas.width = this.imageRef.nativeElement.naturalWidth
    canvas.height = this.imageRef.nativeElement.width
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(this.imageRef.nativeElement, 0, 0, canvas.width, canvas.height)
      const dataInputImage = ctx.getImageData(0, 0, canvas.width, canvas.height)
      console.log(dataInputImage)
    }
  }

  applyLayer(e: any) {}
}
