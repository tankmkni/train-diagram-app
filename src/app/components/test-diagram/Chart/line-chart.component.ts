import { Component, Input } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [BaseChartDirective],
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  template: `
    <canvas baseChart
            [data]="chartData"
            [options]="chartOptions"
            [type]="chartType">
    </canvas>
  `
})
export class LineChartComponent {
  @Input() chartType: 'line' = 'line';
  @Input() chartData!: ChartData<'line'>;
  @Input() chartOptions!: ChartOptions<'line'>;
}
