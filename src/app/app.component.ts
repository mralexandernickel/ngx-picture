import { Component, OnInit } from '@angular/core';

const IMAGES = ['components', 'augury', 'animations', 'cli', 'compiler'];
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
const widths = [200, 300, 400, 500, 600];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {
  title = 'angular-lazyload';
  public items: any[] = [];

  private createItems(): void {
    const items = 1;
    let i = 0;
    while (i < items) {
      const data = {};

      for (let index = 0; index < sizes.length; index++) {
        const size = sizes[index];
        data[size] = {
          url: `https://angular.io/generated/images/marketing/concept-icons/${
            IMAGES[index]
          }.svg`,
          width: widths[index]
        };
      }
      this.items.push(data);
      i++;
    }
  }

  public ngOnInit(): void {
    this.createItems();
  }
}
