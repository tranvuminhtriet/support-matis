import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { RouterOutlet } from "@angular/router"
import { AppComponent } from "./app.component"
import { ImageWithLayerComponent } from "./image-with-layer/image-with-layer.component"
import { ImageService } from "./image.service"
import { AngularDraggableModule } from "angular2-draggable"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

@NgModule({
  declarations: [AppComponent, ImageWithLayerComponent],
  imports: [
    BrowserModule,
    RouterOutlet,
    HttpClientModule,
    FormsModule,
    AngularDraggableModule,
    BrowserAnimationsModule,
  ],
  providers: [ImageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
