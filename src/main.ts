// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { AppRoutes } from './app/app.routes';
import { provideCharts } from 'ng2-charts';

bootstrapApplication(App, {
  providers: [
    provideRouter(AppRoutes),
    provideCharts()
  ]
});
