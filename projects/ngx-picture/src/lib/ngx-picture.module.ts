import { NgModule } from '@angular/core';
import { NgxPictureComponent } from './ngx-picture.component';
import { CommonModule } from '@angular/common';
import { AngularIntersectionModule } from '@mralexandernickel/ngx-intersection';

@NgModule({
  imports: [CommonModule, AngularIntersectionModule],
  exports: [NgxPictureComponent, AngularIntersectionModule],
  declarations: [NgxPictureComponent]
})
export class NgxPictureModule {}
