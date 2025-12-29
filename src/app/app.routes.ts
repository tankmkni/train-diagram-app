import { Routes } from '@angular/router';
import { Diagram } from './components/diagram/diagram';
import { TestCsvLoad } from './components/test-csv-load/test-csv-load';

export const AppRoutes: Routes = [
  { path: '', component: TestCsvLoad }
];
