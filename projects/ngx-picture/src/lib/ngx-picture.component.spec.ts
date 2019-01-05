import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPictureComponent } from './ngx-picture.component';

describe('PictureComponent', () => {
  let component: NgxPictureComponent;
  let fixture: ComponentFixture<NgxPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxPictureComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
