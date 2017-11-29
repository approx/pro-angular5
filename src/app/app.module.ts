import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SceneStudioComponent } from './scene-studio/scene-studio.component';
import { LoaderService } from './loader.service';
import { WelcomeComponent } from './welcome/welcome.component';
import { SceneService } from './scene.service';


@NgModule({
  declarations: [
    AppComponent,
    SceneStudioComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    LoaderService,
    SceneService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
