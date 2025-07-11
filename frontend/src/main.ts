import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; 
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers || [],
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));