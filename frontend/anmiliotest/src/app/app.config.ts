import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

// import { customInterceptor } from './service/custom.interceptor';
import { provideHttpClient,HttpClientModule, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // provideHttpClient(withInterceptors([customInterceptor])),
    importProvidersFrom(HttpClientModule),
    provideToastr(),
    provideAnimations(), provideAnimationsAsync(),
  ],
};
