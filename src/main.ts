import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { AppRoutes } from './app/app.routes';
import { provideCharts } from 'ng2-charts';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideRouter(AppRoutes),
    provideCharts(),
    provideHttpClient()
  ]
});
