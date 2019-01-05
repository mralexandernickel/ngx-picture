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

  it('should teardown clean', () => {
    const spyDestroyed$: jasmine.Spy = spyOn(component.destroyed$, 'next');
    const spyCurrentImage$: jasmine.Spy = spyOn(
      component.currentImage$,
      'complete'
    );
    const spyUnobserve: jasmine.Spy = spyOn(
      component.intersectionObserverService,
      'unobserveElement'
    );
    component.ngOnDestroy();
    expect(spyDestroyed$).toHaveBeenCalled();
    expect(spyCurrentImage$).toHaveBeenCalled();
    expect(spyUnobserve).toHaveBeenCalled();
  });

  it('should emit directly if preload is false', () => {
    component.preload = false;
    const spyCurrentImage$: jasmine.Spy = spyOn(
      component.currentImage$,
      'next'
    );
    component.setImage();
    expect(spyCurrentImage$).toHaveBeenCalled();
  });
});
