import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CoreModule } from '@trilliangular/core';
import { PixiRuntimeModule } from '@trilliangular/runtime-pixi';

import { AppComponent } from './app.component';
import { MazeComponent } from './maze/maze.component';
import { PlayerComponent } from './player/player.component';


@NgModule({
  declarations: [
    AppComponent,
    MazeComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CoreModule,
    PixiRuntimeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
