import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { forkJoin, map, Observable } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { LineChart } from '../shared/chart-js/line-chart';
import { DiagramDataLoaderService } from './chart/diagram-data-loader-service';
import { DiagramChartBuilderService } from './chart/diagram-chart-builder-service';

@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [LineChart, AsyncPipe],
  template: `
    @if (diagramConfig$ | async; as cfg) {
      <app-line-chart
        [chartData]="cfg.data"
        [chartOptions]="cfg.options">
      </app-line-chart>
    }
  `
})
export class DiagramPage {

  diagramConfig$: Observable<{
    data: ChartData<'line'>;
    options: ChartOptions<'line'>;
  }>;

  constructor(
    private dataLoader: DiagramDataLoaderService,
    private chartBuilder: DiagramChartBuilderService
  ) {
    this.diagramConfig$ = forkJoin({
      stations: this.dataLoader.getStations(),
      trainTypes: this.dataLoader.getTrainTypes(),
      timetable: this.dataLoader.getTimeTable()
    }).pipe(
      map(({ stations, trainTypes, timetable }) => {
        this.chartBuilder.loadData(stations, trainTypes, timetable);
        return{
          data: this.chartBuilder.getChartData(),
          options: this.chartBuilder.getChartOptions()
        }
      })
    );
  }
}