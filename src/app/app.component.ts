import { Component, OnInit } from '@angular/core';
import { createImages } from '@mralexandernickel/ngx-picture';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {
  title = 'angular-lazyload';
  public items: any[] = createImages(40);

  public ngOnInit(): void {}
}
