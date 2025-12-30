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
            type="line"
            [data]="chartData"
            [options]="chartOptions"
    ></canvas>
  `
})
export class LineChart {
  @Input() chartData!: ChartData<'line'>;
  @Input() chartOptions!: ChartOptions<'line'>;
}
