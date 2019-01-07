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
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BreakPoint, BREAKPOINTS } from '@angular/flex-layout';
import { takeUntil, debounceTime } from 'rxjs/operators';

export function sortAscendingPriority(a: BreakPoint, b: BreakPoint): number {
  const pA = a.priority || 0;
  const pB = b.priority || 0;
  return pA - pB;
}

export function sortDescendingPriority(a: BreakPoint, b: BreakPoint): number {
  const priorityA = a ? a.priority || 0 : 0;
  const priorityB = b ? b.priority || 0 : 0;
  return priorityB - priorityA;
}

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

  public breakpointMap = {};

  constructor(
    public elRef: ElementRef,
    public breakpointObserver: BreakpointObserver,
    public cr: ChangeDetectorRef,
    @Inject(BREAKPOINTS) public breakpoints: BreakPoint[]
  ) {
    // const mapped = this.breakpoints.map(a => a.mediaQuery);
    // console.log('before', this.breakpoints);
    // console.log('after', this.breakpoints.sort(sortDescendingPriority));

    for (const breakpoint of this.breakpoints) {
      this.breakpointMap[breakpoint.mediaQuery] = breakpoint;
    }
    // console.log(this.breakpointMap);
  }

  public getBreakpointBy(key: string, value: string): BreakPoint {
    return this.breakpoints.find(breakpoint => breakpoint[key] === value);
  }

  //
  // * getCurrentImage would be better as it could be used directly inside setImage
  // * maybe theres a smarter way with less iteration -> heavier use of sorting?
  //
  public getCurrentMatch(breakpointState: BreakpointState): any {
    const start = performance.now();
    const matches = Object.keys(breakpointState.breakpoints).filter(
      breakpoint => breakpointState.breakpoints[breakpoint]
    );

    const matchingBreakpoints = [];
    for (const mediaQuery of matches) {
      matchingBreakpoints.push(this.breakpointMap[mediaQuery]);
    }

    const matchingBreakpointsSorted = matchingBreakpoints.sort(
      sortDescendingPriority
    );

    let currentMatch;
    for (const match of matchingBreakpointsSorted) {
      if (this.images[match.alias]) {
        currentMatch = match.alias;
        break;
      }
    }

    const duration = performance.now() - start;
    // console.log('==>', duration, currentMatch);

    return currentMatch;
  }

  public subscribeBreakpoints(): void {
    this.breakpointObserver
      .observe(this.breakpoints.map(a => a.mediaQuery))
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(3)
      )
      .subscribe(result => {
        this.currentSize = this.getCurrentMatch(result);
        this.setImage();
        this.cr.markForCheck();
      });

    // for (const size of Object.keys(this.images)) {
    //   this.breakpointObserver
    //     .observe(this.getBreakpointBy('alias', size).mediaQuery)
    //     .pipe(takeUntil(this.destroyed$))
    //     .subscribe(result => {
    //       if (result.matches) {
    //         console.log(
    //           this.getBreakpointBy(
    //             'mediaQuery',
    //             Object.keys(result.breakpoints)[0]
    //           )
    //         );
    //         this.currentSize = size;
    //         this.setImage();
    //         this.cr.markForCheck();
    //       }
    //     });
    // }
  }

  /**
   *
   * @param imageConstructor a constructor to be able to unit-test old browsers
   */
  public setImage(imageConstructor: any = Image): void {
    // If this.preload is true
    if (this.preload) {
      const img = new imageConstructor();
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

  public ngOnInit(): void {
    this.subscribeBreakpoints();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.currentImage$.complete();
  }
}
