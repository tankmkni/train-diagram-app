import { Routes } from '@angular/router';

import { TestDiagramComponent } from './components/test-diagram/test-diagram.component';

export const AppRoutes: Routes = [
  { path: '', component: TestDiagramComponent } // デフォルトで TestDiagramComponent を表示
];
