import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { forkJoin, ReplaySubject } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { LineChart } from '../shared/chart-js/line-chart';
import { DiagramDataLoaderService } from './chart/diagram-data-loader-service';
import { DiagramChartBuilderService } from './chart/diagram-chart-builder-service';
import { DiagramChartAxisManagerService } from './chart/diagram-chart-axis-manager-service';


@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [LineChart, AsyncPipe],
  template: `
    <div class="controls">
      <button (click)="toggleStationReverse()">駅軸反転</button>
      <button (click)="toggleAxisMode()">縦横入れ替え</button>
    </div>

    @if (diagramConfig$ | async; as cfg) {
      <app-line-chart
        [chartData]="cfg.data"
        [chartOptions]="cfg.options">
      </app-line-chart>
    }
  `
})
export class DiagramPage {

  private diagramConfigSubject = new ReplaySubject<{ data: ChartData<'line'>; options: ChartOptions<'line'> }>(1);
  diagramConfig$ = this.diagramConfigSubject.asObservable();

  constructor(
    private dataLoader: DiagramDataLoaderService,
    private chartBuilder: DiagramChartBuilderService,
    private axisManager: DiagramChartAxisManagerService
  ) {
    forkJoin({
      stations: this.dataLoader.getStations(),
      trainTypes: this.dataLoader.getTrainTypes(),
      timetable: this.dataLoader.getTimeTable()
    }).subscribe(({ stations, trainTypes, timetable }) => {
      this.chartBuilder.loadData(stations, trainTypes, timetable);
      this.refreshChart();
    });
  }

  private refreshChart() {
    this.diagramConfigSubject.next({
      data: this.chartBuilder.getChartData(),
      options: this.chartBuilder.getChartOptions()
    });
  }

  toggleStationReverse() {
    this.axisManager.toggleStationReverse();
    this.refreshChart();
  }

  toggleAxisMode() {
    this.axisManager.toggleAxisMode();
    this.refreshChart();
  }
}