import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  Inject
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakPoint, BREAKPOINTS } from '@angular/flex-layout';
import { IntersectionObserverService } from './intersection-observer.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lib-ngx-picture',
  templateUrl: './ngx-picture.component.html',
  styleUrls: ['./ngx-picture.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxPictureComponent implements OnInit, OnDestroy {
  @Input() public images: any;

  @Input() public preload = true;

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

  constructor(
    public intersectionObserverService: IntersectionObserverService,
    public elRef: ElementRef,
    public breakpointObserver: BreakpointObserver,
    public cr: ChangeDetectorRef,
    @Inject(BREAKPOINTS) public breakpoints: BreakPoint[]
  ) {}

  public getBreakpoint(alias: string): BreakPoint {
    return this.breakpoints.find(breakpoint => breakpoint.alias === alias);
  }

  public subscribeBreakpoints(): void {
    for (const size of Object.keys(this.images)) {
      this.breakpointObserver
        .observe(this.getBreakpoint(size).mediaQuery)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(result => {
          if (result.matches) {
            this.currentSize = size;
            this.setImage();
            this.cr.markForCheck();
          }
        });
    }
  }

  public setImage(): void {
    // If this.preload is true
    if (this.preload) {
      const img = new Image();
      img.src = this.images[this.currentSize].url;

      // If browser supports Image.decode
      if (img.decode) {
        img.decode().then(() => {
          this.currentImage$.next(this.images[this.currentSize]);
        });

        return;
      }

      // Browser doesn't support Image.decode, fall back to regular onload
      (img as HTMLImageElement).onload = (e: Event) => {
        this.currentImage$.next(this.images[this.currentSize]);
      };

      return;
    }

    // If this.preload is false, emit directly
    this.currentImage$.next(this.images[this.currentSize]);
  }

  public observeElement(): void {
    this.intersectionObserverService.observeElement(
      this.elRef.nativeElement,
      this.setImage.bind(this)
    );
  }

  public ngOnInit(): void {
    this.subscribeBreakpoints();
    this.observeElement();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.currentImage$.complete();
    this.intersectionObserverService.unobserveElement(this.elRef.nativeElement);
  }
}
