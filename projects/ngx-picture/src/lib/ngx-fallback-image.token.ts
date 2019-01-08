import { InjectionToken } from '@angular/core';
import { INgxImage } from '@mralexandernickel/ngx-picture/lib/typings';

export const DEFAULT_FALLBACK_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export const FALLBACK_IMAGE = new InjectionToken<string>(
  'NgxPicture fallbackImage',
  {
    providedIn: 'root',
    factory: () => DEFAULT_FALLBACK_IMAGE
  }
);
