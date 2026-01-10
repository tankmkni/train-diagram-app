import { Component, Input } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import 'chartjs-adapter-date-fns';  // Chart.js の time スケールを date-fns で扱うためのアダプタ


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
  @Input({ required: true }) chartData!: ChartData<'line'>;
  @Input() chartOptions?: ChartOptions<'line'>;  // 指定しなければ Chart.js のデフォルト設定で描画
}
