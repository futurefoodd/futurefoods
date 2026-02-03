import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, provideAppInitializer, inject} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {TranslateService, provideTranslateService, provideTranslateLoader} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {provideHttpClient, withFetch} from "@angular/common/http";

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), 
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
    ),
    provideClientHydration(withEventReplay()), provideAnimationsAsync(),  providePrimeNG({
    theme: {
        preset: Aura
    }
}),
provideHttpClient(
  withFetch()
),
provideTranslateService({
  loader: provideTranslateHttpLoader({
    prefix: '/i18n/',
    suffix: '.json'
  }),
  fallbackLang: 'en',
  lang: 'en'
}),
provideAppInitializer(() => {
  const  translate = inject(TranslateService);
  translate.use(translate.getBrowserLang() || "en");
})
  ]
};
