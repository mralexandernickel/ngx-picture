import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPictureComponent } from './ngx-picture.component';
import { createImages } from './images.mock.spec';
import { BREAKPOINTS, DEFAULT_BREAKPOINTS } from '@angular/flex-layout';
import { AngularIntersectionModule } from '@mralexandernickel/angular-intersection';
import { SimpleChanges, SimpleChange } from '@angular/core';

describe('PictureComponent', () => {
  let component: NgxPictureComponent;
  let fixture: ComponentFixture<NgxPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AngularIntersectionModule],
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

  it('should not subscribe breakpoints if src is a string', () => {
    component.images =
      'https://angular.io/generated/images/marketing/concept-icons/augury.svg';
    const spySubscribeBreakpoints: jasmine.Spy = spyOn(
      component,
      'subscribeBreakpoints'
    );
    component.ngOnInit();
    expect(spySubscribeBreakpoints).not.toHaveBeenCalled();
  });

  it('should return an object with url-key if src is a string', () => {
    component.images =
      'https://angular.io/generated/images/marketing/concept-icons/augury.svg';
    const result = component.getCurrentImage();
    expect(result.constructor).toBe(Object);
    expect(result['hiRes'].src).toBe(component.images);
  });

  it('should call observeRestart if its not the first change', () => {
    const change = new SimpleChange('', '', false);
    const spyObserveRestart: jasmine.Spy = spyOn(
      component.libEnterViewport,
      'observeRestart'
    );
    component.ngOnChanges({ images: change });
    expect(spyObserveRestart).toHaveBeenCalled();
  });

  it('should do nothing if its the first change', () => {
    const change = new SimpleChange('', '', true);
    const spyObserveRestart: jasmine.Spy = spyOn(
      component.libEnterViewport,
      'observeRestart'
    );
    component.ngOnChanges({ images: change });
    expect(spyObserveRestart).not.toHaveBeenCalled();
  });

  it('should not call currentImage$.next if hiResloaded is true', () => {
    component.hiResLoaded = true;
    const spyCurrentImage$: jasmine.Spy = spyOn(
      component.currentImage$,
      'next'
    );
    component.emitImage({ src: '' }, false);
    expect(spyCurrentImage$).not.toHaveBeenCalled();
  });

  it('Should call loadImage ONCE if image only has a src attribute', () => {
    component.currentSize = 'md';
    component.images = {
      md: {
        src: 'https://placeimg.com/300/225/arch'
      }
    };
    const spyComponentLoadImage: jasmine.Spy = spyOn(component, 'loadImage');
    component.setImage();
    expect(spyComponentLoadImage).toHaveBeenCalledTimes(1);
  });

  it('Should call loadImage ONCE if image only has a lowRes attribute', () => {
    component.currentSize = 'md';
    component.images = {
      md: {
        lowRes: {
          src: 'https://placeimg.com/300/225/arch'
        }
      }
    };
    const spyComponentLoadImage: jasmine.Spy = spyOn(component, 'loadImage');
    component.setImage();
    expect(spyComponentLoadImage).toHaveBeenCalledTimes(1);
  });

  it('Should call loadImage ONCE if image only has a highRes attribute', () => {
    component.currentSize = 'md';
    component.images = {
      md: {
        hiRes: {
          src: 'https://placeimg.com/300/225/arch'
        }
      }
    };
    const spyComponentLoadImage: jasmine.Spy = spyOn(component, 'loadImage');
    component.setImage();
    expect(spyComponentLoadImage).toHaveBeenCalledTimes(1);
  });

  it('Should never loadImage if image has no src, lowRes or hiRes attribute', () => {
    component.currentSize = 'md';
    component.images = {
      md: {}
    };
    const spyComponentLoadImage: jasmine.Spy = spyOn(component, 'loadImage');
    component.setImage();
    expect(spyComponentLoadImage).not.toHaveBeenCalled();
  });

  it('should emit directly if lowRes.src is already cached', () => {
    component.currentSize = 'md';
    component.images = {
      md: {
        lowRes: {
          src: 'https://placeimg.com/300/225/arch'
        }
      }
    };
    const spyCacheServiceGet: jasmine.Spy = spyOn(
      component.cacheService,
      'get'
    ).and.returnValue(true);
    const spyComponentEmitImage: jasmine.Spy = spyOn(component, 'emitImage');
    component.setImage();
    expect(spyComponentEmitImage).toHaveBeenCalledTimes(1);
  });

  it('should emit directly if src is already cached', () => {
    component.currentSize = 'md';
    component.images = {
      md: {
        src: 'https://placeimg.com/300/225/arch'
      }
    };
    const spyCacheServiceGet: jasmine.Spy = spyOn(
      component.cacheService,
      'get'
    ).and.returnValue(true);
    const spyComponentEmitImage: jasmine.Spy = spyOn(component, 'emitImage');
    component.setImage();
    expect(spyComponentEmitImage).toHaveBeenCalledTimes(1);
  });
});
