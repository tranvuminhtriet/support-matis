import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { RouterOutlet } from "@angular/router"
import { ImageService } from "./image.service"
import { HttpClientModule } from "@angular/common/http"
import { AppComponent } from "./app.component"
import { ImageWithLayerComponent } from "./image-with-layer/image-with-layer.component"
import { ImageApplyLayerComponent } from "./image-apply-layer/image-apply-layer.component"
import { FormsModule } from "@angular/forms"

@NgModule({
  declarations: [AppComponent, ImageWithLayerComponent, ImageApplyLayerComponent],
  imports: [BrowserModule, RouterOutlet, HttpClientModule, FormsModule],
  providers: [ImageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
