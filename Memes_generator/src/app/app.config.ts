import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TokenInterceptor } from './services/token-interceptor.service';


import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync(),importProvidersFrom(HttpClientModule),{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true // Indique que cet intercepteur est multi-instance
  }]
};
