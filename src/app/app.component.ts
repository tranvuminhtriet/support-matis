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
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(this.imageRef.nativeElement, canvas.width, canvas.height)
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    }
  }

  applyLayer(e: any) {}
}
