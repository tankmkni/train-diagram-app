import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { LineChartComponent } from './Chart/line-chart.component';

@Component({
  selector: 'app-test-diagram',
  standalone: true,
  imports: [LineChartComponent],
  template: `
    <h1>Train Diagram</h1>
    <app-line-chart 
      [chartType]="'line'" 
      [chartData]="chartData" 
      [chartOptions]="chartOptions">
    </app-line-chart>
  `
})
export class TestDiagramComponent {

  chartData: ChartData<'line'> = {
    labels: [
      new Date(2025,11,27,8,0), new Date(2025,11,27,8,12),
      new Date(2025,11,27,8,20), new Date(2025,11,27,8,30),
      new Date(2025,11,27,8,42), new Date(2025,11,27,8,50),
      new Date(2025,11,27,9,0), new Date(2025,11,27,9,12),
      new Date(2025,11,27,9,20), new Date(2025,11,27,9,30)
    ],
    datasets: [
      { label: 'Train001', data: [0,1,2,3,4,5,6,7,8,9], borderColor: 'cyan', fill: false },
      { label: 'Train002', data: [9,8,7,6,5,4,3,2,1,0], borderColor: 'red', fill: false },
      { label: 'Train002', data: [8,7,6,5,4,3,2,1,0,1], borderColor: 'blue', fill: false },
      { label: 'Train002', data: [7,6,5,4,3,2,1,0,1,2], borderColor: 'green', fill: false },
      { label: 'Train002', data: [6,5,4,3,2,1,0,1,2,3], borderColor: 'orange', fill: false }
    ]
  };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: { unit: 'minute', displayFormats: { minute: 'HH:mm' } },
        title: { display: true, text: 'Time' }
      },
      y: {
        title: { display: true, text: 'Station' }
      }
    }
  };
}
