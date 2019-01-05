import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxPictureModule } from '@mralexandernickel/ngx-picture';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxPictureModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
