import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BreakPoint, BREAKPOINTS } from '@angular/flex-layout';
import { DomSanitizer } from '@angular/platform-browser';
import { IntersectionPresentStartDirective } from '@mralexandernickel/ngx-intersection';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FALLBACK_IMAGE } from './ngx-fallback-image.token';
import { NgxPictureCacheService } from './ngx-picture-cache.service';
import { INgxImage, INgxImageSet, INgxPictureSet } from './typings';

export function isDataUri(img: HTMLImageElement): boolean {
  return img.src.slice(0, 5) === 'data:';
}

@Component({
  selector: 'lib-ngx-picture',
  templateUrl: './ngx-picture.component.html',
  styleUrls: ['./ngx-picture.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxPictureComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() public images: INgxPictureSet | string;

  @Input() public preload = true;

  @Output() public imageLoaded: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  @ViewChild('ngxIntersectionPresentStart')
  public ngxIntersectionPresentStart: IntersectionPresentStartDirective;

  @Input() public fallbackImage: INgxImage;

  public currentImage$: BehaviorSubject<INgxImage>;

  public currentSize: string;

  public destroyed$ = new Subject();

  public hiResLoaded = false;

  constructor(
    public elRef: ElementRef,
    public breakpointObserver: BreakpointObserver,
    public cr: ChangeDetectorRef,
    @Inject(BREAKPOINTS)
    public breakpoints: BreakPoint[],
    public sanitizer: DomSanitizer,
    @Inject(FALLBACK_IMAGE) fallbackImage: string,
    @Inject(PLATFORM_ID) public platformId: string,
    public cacheService: NgxPictureCacheService
  ) {
    this.setDefaultsForServerSide();
    this.fallbackImage = {
      src: this.sanitizer.bypassSecurityTrustUrl(fallbackImage)
    };
  }

  public setDefaultsForServerSide(): void {
    if (!this.isBrowser()) {
      this.preload = false;
      this.currentSize = 'lg';
    }
  }

  public getBreakpoint(alias: string): BreakPoint {
    return this.breakpoints.find(breakpoint => breakpoint.alias === alias);
  }

  public isSingleSrc(): boolean {
    return this.images.constructor === String;
  }

  public getCurrentImage(): INgxImage | INgxImageSet {
    if (this.isSingleSrc()) {
      return {
        hiRes: {
          src: this.images
        },
        lowRes: {
          src: this.images
        }
      };
    } else {
      return this.images[this.currentSize];
    }
  }

  public subscribeBreakpoints(): void {
    for (const size of Object.keys(this.images)) {
      this.breakpointObserver
        .observe(this.getBreakpoint(size).mediaQuery)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(result => {
          if (result.matches) {
            this.currentSize = size;
            this.ngxIntersectionPresentStart.observeRestart();
            this.cr.markForCheck();
          }
        });
    }
  }

  public emitImage(currentImage: INgxImage, isHiRes: boolean): void {
    if (typeof currentImage.src === 'string') {
      this.cacheService.set(currentImage.src);
    }
    if (!this.hiResLoaded) {
      this.currentImage$.next(currentImage);
    }
    if (isHiRes) {
      this.hiResLoaded = true;
    }
    this.imageLoaded.emit(true);
  }

  public loadImage(
    currentImage: INgxImage,
    imageConstructor: any,
    isHiRes: boolean
  ): void {
    // If this.preload is true
    if (this.preload) {
      const img = new imageConstructor();
      img.src = currentImage.src;

      // If browser supports Image.decode
      if (img.decode && !isDataUri(img)) {
        img
          .decode()
          .then(() => {
            this.emitImage(currentImage, isHiRes);
          })
          .catch((err: DOMException) => {
            console.log(err.message);
          });

        return;
      }

      // Browser doesn't support Image.decode, fall back to regular onload
      img.onload = (e: Event) => {
        this.emitImage(currentImage, isHiRes);
      };

      return;
    }

    // If this.preload is false, emit directly
    this.emitImage(currentImage, isHiRes);
  }

  public isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   *
   * @param imageConstructor a constructor to be able to unit-test old browsers
   */
  public setImage(imageConstructor?: any): void {
    if (!imageConstructor && this.isBrowser()) {
      imageConstructor = Image;
    }
    const currentImage = this.getCurrentImage();
    this.hiResLoaded = false;

    // If hiRes is already cached -> emit and return
    if (
      'hiRes' in currentImage &&
      typeof currentImage.hiRes.src === 'string' &&
      this.cacheService.get(currentImage.hiRes.src)
    ) {
      this.emitImage(currentImage.hiRes, true);
      return;
    }

    // If lowRes is already cached -> emit and return
    let lowResAlreadyCached = false;
    if (
      'lowRes' in currentImage &&
      typeof currentImage.lowRes.src === 'string' &&
      this.cacheService.get(currentImage.lowRes.src)
    ) {
      lowResAlreadyCached = true;
      const isFinal = !currentImage.hiRes;
      this.emitImage(currentImage.lowRes, isFinal);
    }

    // If src is already cached -> emit and return
    if (
      'src' in currentImage &&
      typeof currentImage.src === 'string' &&
      this.cacheService.get(currentImage.src)
    ) {
      this.emitImage(currentImage, true);
      return;
    }

    // reset to fallbackImage during loading
    // this.loadImage(this.fallbackImage, imageConstructor, false);
    if (!lowResAlreadyCached) {
      this.emitImage(this.fallbackImage, false);
    }

    // currentImage has only one src attribute (now lowRes/hiRes)
    if ('src' in currentImage) {
      this.loadImage(currentImage, imageConstructor, true);
      return;
    }

    // currentImage has a low-resolution version
    if (currentImage.lowRes && !lowResAlreadyCached) {
      const isFinal = !currentImage.hiRes;
      this.loadImage(currentImage.lowRes, imageConstructor, isFinal);
      // stop if currentImage has no high-resolution version
      if (isFinal) {
        return;
      }
    }

    // currentImage has a high-resolution version
    if (currentImage.hiRes) {
      this.loadImage(currentImage.hiRes, imageConstructor, true);
    }
  }

  /**
   * We need to run this code inside AfterViewInit, because in OnInit we
   * are setting/emitting the currentImage$ which is used inside the *ngIf
   * inside the template, which itself is adding the ViewChild reference.
   *
   * So if currentImage$ hasn't emitted, the element in the template is not
   * rendered and since Angular 8 the ViewChild then is also not available.
   *
   * This would throw an error inside subscribeBreakpoints as it is relying on
   * this.libEnterViewport.
   */
  public ngAfterViewInit(): void {
    if (this.isBrowser()) {
      if (!this.isSingleSrc()) {
        this.subscribeBreakpoints();
      }
    }
  }

  public ngOnInit(): INgxImage {
    let initialImage = this.fallbackImage;

    if (!this.isBrowser()) {
      if (
        this.images[this.currentSize] &&
        this.images[this.currentSize].hiRes
      ) {
        initialImage = this.images[this.currentSize].hiRes;
      }
    }
    this.currentImage$ = new BehaviorSubject<INgxImage>(initialImage);

    return initialImage;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.images && !changes.images.isFirstChange()) {
      this.ngxIntersectionPresentStart.observeRestart();
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.currentImage$.complete();
  }
}
