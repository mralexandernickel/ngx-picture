import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPictureComponent } from './ngx-picture.component';
import { createImages } from './images.mock.spec';
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
    component.currentSize = 'sm';
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
    component.ngOnDestroy();
    expect(spyDestroyed$).toHaveBeenCalled();
    expect(spyCurrentImage$).toHaveBeenCalled();
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

  it('should use Image.decode if available in browser', done => {
    const spyCurrentImage$: jasmine.Spy = spyOn(
      component.currentImage$,
      'next'
    );
    const mockDecode = new Promise((resolve, reject) => {
      resolve();
      setTimeout(() => {
        done();
        expect(spyCurrentImage$).toHaveBeenCalled();
      }, 100);
    });
    const mockImage = {
      onload: () => {},
      decode: () => {
        return mockDecode;
      }
    };
    const mockImageConstructor: any = () => {
      return mockImage;
    };
    component.setImage(mockImageConstructor);
  });

  it('should set onload if Image.decode is not available in browser', () => {
    const mockImage = {
      onload: () => {}
    };
    const mockImageConstructor: any = () => {
      return mockImage;
    };
    component.setImage(mockImageConstructor);
    expect(mockImageConstructor).toBeDefined();
  });

  it('should call currentImage$.next onload', () => {
    const mockImage = {
      onload: () => {}
    };
    const mockImageConstructor: any = () => {
      return mockImage;
    };
    component.setImage(mockImageConstructor);
    const spyCurrentImage$: jasmine.Spy = spyOn(
      component.currentImage$,
      'next'
    );
    mockImage.onload();
    expect(spyCurrentImage$).toHaveBeenCalled();
  });
});
