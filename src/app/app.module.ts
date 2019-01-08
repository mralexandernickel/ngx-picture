import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  NgxPictureModule,
  FALLBACK_IMAGE
} from '@mralexandernickel/ngx-picture';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxPictureModule],
  // providers: [
  //   {
  //     provide: FALLBACK_IMAGE,
  //     useValue: CUSTOM_FALLBACK_IMAGE
  //   }
  // ],
  bootstrap: [AppComponent]
})
export class AppModule {}
