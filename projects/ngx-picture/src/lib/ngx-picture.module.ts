import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AngularIntersectionModule,
  IntersectionDirectivesModule
} from '@mralexandernickel/ngx-intersection';
import { NgxPictureComponent } from './ngx-picture.component';

@NgModule({
  imports: [
    CommonModule,
    AngularIntersectionModule,
    IntersectionDirectivesModule
  ],
  exports: [
    NgxPictureComponent,
    AngularIntersectionModule,
    IntersectionDirectivesModule
  ],
  declarations: [NgxPictureComponent]
})
export class NgxPictureModule {}
