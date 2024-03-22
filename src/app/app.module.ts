import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { RouterOutlet } from "@angular/router"
import { ImageService } from "./image.service"
import { HttpClientModule } from "@angular/common/http"
import { AppComponent } from "./app.component"

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RouterOutlet, HttpClientModule],
  providers: [ImageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
