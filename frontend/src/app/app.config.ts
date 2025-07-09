import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
 // providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      BrowserAnimationsModule,
      ReactiveFormsModule,
      FormsModule,
    ),
    provideAnimationsAsync(),
        providePrimeNG({
                theme: {
                preset: Aura,
                options: {
                darkModeSelector: false, // Desabilita modo escuro
                  cssLayer: {
                      name: 'primeng',
                      order: 'tailwind-base, primeng, tailwind-utilities'
                    }
                }
            }
        })
    ]
};