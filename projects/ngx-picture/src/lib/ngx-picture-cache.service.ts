import { Injectable } from '@angular/core';
import { INgxCacheMap } from './typings';

@Injectable({
  providedIn: 'root'
})
export class NgxPictureCacheService {
  public cacheMap: INgxCacheMap = {};

  public get(src: string): boolean {
    return this.cacheMap[src];
  }

  public set(src: string): boolean {
    return (this.cacheMap[src] = true);
  }
}
