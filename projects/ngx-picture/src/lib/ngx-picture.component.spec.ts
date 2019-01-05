import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPictureComponent } from './ngx-picture.component';
import { createImages } from './images.mock';
import { BREAKPOINTS, DEFAULT_BREAKPOINTS } from '@angular/flex-layout';

describe('PictureComponent', () => {
  let component: NgxPictureComponent;
  let fixture: ComponentFixture<NgxPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxPictureComponent],
      providers: [
        {
          provide: BREAKPOINTS,
          useValue: DEFAULT_BREAKPOINTS
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxPictureComponent);
    component = fixture.componentInstance;
    component.images = createImages(1)[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
