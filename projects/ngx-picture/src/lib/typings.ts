import { SafeUrl } from '@angular/platform-browser';

export interface INgxImage {
  src: string | SafeUrl;
  width?: number;
  height?: number;
  alt?: string;
}

export interface INgxImageSet {
  lowRes?: INgxImage;
  hiRes?: INgxImage;
}

// possible to extract xs, sm etc. from FlexLayoutMoudle/BREAKPOINTS?
export interface INgxPictureSet {
  [s: string]: INgxImage | INgxImageSet;
}
