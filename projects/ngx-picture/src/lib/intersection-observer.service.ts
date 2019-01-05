import { Injectable } from '@angular/core';
import 'intersection-observer';

@Injectable({
  providedIn: 'root'
})
export class IntersectionObserverService {
  private observer: IntersectionObserver;

  private callbacks: Map<Element, Function> = new Map();

  constructor() {
    const options = {
      rootMargin: '0px 0px 0px 0px',
      threshold: 0.0
    };

    this.observer = new IntersectionObserver(
      this.intersectionObserverCallback.bind(this),
      options
    );
  }

  public intersectionObserverCallback(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ): any {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.callbacks.get(entry.target)();
      }
    }
  }

  public unobserveElement(element: Element): void {
    this.observer.unobserve(element);
    this.callbacks.delete(element);
  }

  public observeElement(element: Element, callback: Function): void {
    this.callbacks.set(element, callback);
    this.observer.observe(element);
  }
}
