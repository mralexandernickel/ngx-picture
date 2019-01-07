import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  Inject,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakPoint, BREAKPOINTS } from '@angular/flex-layout';
import { takeUntil } from 'rxjs/operators';
import { EnterViewportDirective } from '@mralexandernickel/angular-intersection';

@Component({
  selector: 'lib-ngx-picture',
  templateUrl: './ngx-picture.component.html',
  styleUrls: ['./ngx-picture.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxPictureComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public images: any;

  @Input() public preload = true;

  @Output() public imageLoaded: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  @ViewChild('libEnterViewport')
  public libEnterViewport: EnterViewportDirective;

  private fallbackImage = {
    url:
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    width: 1
  };

  public currentImage$: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.fallbackImage
  );

  public currentSize: string;

  public destroyed$ = new Subject();

  public imageAlreadyLoaded = false;

  constructor(
    public elRef: ElementRef,
    public breakpointObserver: BreakpointObserver,
    public cr: ChangeDetectorRef,
    @Inject(BREAKPOINTS) public breakpoints: BreakPoint[]
  ) {}

  public getBreakpoint(alias: string): BreakPoint {
    return this.breakpoints.find(breakpoint => breakpoint.alias === alias);
  }

  public isSingleSrc(): boolean {
    // debugger;
    return this.images.constructor === String;
  }

  public getCurrentImage(): any {
    if (this.isSingleSrc()) {
      return {
        url: this.images
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
            this.libEnterViewport.observeRestart();
            this.cr.markForCheck();
          }
        });
    }
  }

  public emitImageLoaded(): void {
    this.imageAlreadyLoaded = true;
    this.imageLoaded.emit(true);
  }

  /**
   *
   * @param imageConstructor a constructor to be able to unit-test old browsers
   */
  public setImage(imageConstructor: any = Image): void {
    this.imageAlreadyLoaded = false;
    // If this.preload is true
    if (this.preload) {
      const img = new imageConstructor();
      img.src = this.getCurrentImage().url;

      // If browser supports Image.decode
      if (img.decode) {
        img.decode().then(() => {
          this.currentImage$.next(this.getCurrentImage());
          this.emitImageLoaded();
        });

        return;
      }

      // Browser doesn't support Image.decode, fall back to regular onload
      (img as HTMLImageElement).onload = (e: Event) => {
        this.currentImage$.next(this.getCurrentImage());
        this.emitImageLoaded();
      };

      return;
    }

    // If this.preload is false, emit directly
    this.currentImage$.next(this.getCurrentImage());
    this.emitImageLoaded();
  }

  public ngOnInit(): void {
    if (!this.isSingleSrc()) {
      this.subscribeBreakpoints();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.images && !changes.images.isFirstChange()) {
      this.libEnterViewport.observeRestart();
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.currentImage$.complete();
  }
}
