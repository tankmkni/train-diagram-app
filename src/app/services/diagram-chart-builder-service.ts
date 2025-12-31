import { Injectable } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

import { Station, TrainType, TimetableRow } from './diagram-data-loader-service';
import { DiagramChartDataBuilder } from '../utils/diagram-chart-data-builder';
import { DiagramChartOptionsBuilder } from '../utils/diagram-chart-options-builder';

@Injectable({
  providedIn: 'root'
})
export class DiagramChartBuilderService {

  private readonly trainTypeColorMap: Record<string, string> = {
    NOR: 'gold',
    RAP: 'gold',
    ALL: 'blue',
    EXP: 'tomato',
    LTD: 'orange',
    SPX: 'orange'
  };
  getTrainTypeColor(trainTypeId: string): string {
    return this.trainTypeColorMap[trainTypeId] ?? 'black';
  }


  private stations: Station[] = [];
  private trainTypes: TrainType[] = [];
  private timetable: TimetableRow[] = [];

  private stationDistanceMap?: Map<string, number>;


  /**
   * CSVロード後に一度だけ呼ぶ
   */
  loadData(
    stations: Station[],
    trainTypes: TrainType[],
    timetable: TimetableRow[]
  ): void {
    this.stations = stations;
    this.trainTypes = trainTypes;
    this.timetable = timetable;

    this.stationDistanceMap = undefined;
  }

  /**
   * Chart.js 用データ生成
   */
  getChartData(): ChartData<'line'> {
    this.assertLoaded();
    return DiagramChartDataBuilder.buildData(
      this.stations,
      this.trainTypes,
      this.timetable,
      (trainTypeId) => this.getTrainTypeColor(trainTypeId)
    );
  }

  /**
   * Chart.js 用オプション生成
   */
  getChartOptions(): ChartOptions<'line'> {
    this.assertLoaded();

    // stationId → 距離 を name に変換
    const distanceToStationName = new Map<number, string>();
    for (const [id, km] of this.getStationDistanceMap()) {
      const station = this.stations.find(s => s.id === id)!;
      distanceToStationName.set(km, station.name);
    }

    return DiagramChartOptionsBuilder.buildOptions(
      distanceToStationName,
      this.timetable,
      this.minutesToHHmm.bind(this),
      this.HHmmToMinutes.bind(this)
    );
  }

  /**
   * "HH:mm" → 分
   */
  HHmmToMinutes(time: string): number | null {
    if (time === '---') return null;
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  /**
   * 分 → "HH:mm"
   */
  minutesToHHmm(minute: number): string {
    const h = Math.floor(minute / 60);
    const m = minute % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  /**
   * stationId → 累積距離
   */
  getStationDistanceMap(): Map<string, number> {

    if (this.stationDistanceMap) {
      return this.stationDistanceMap;
    }

    const map = new Map<string, number>();
    let sum = 0;

    for (const s of this.stations) {
      sum += s.distanceKm;
      map.set(s.id, Number(sum.toFixed(1)));
    }

    this.stationDistanceMap = map;
    return map;
  }

  /**
   * データ未ロード防止
   */
  private assertLoaded(): void {
    if (!this.stations.length || !this.timetable.length) {
      throw new Error('DiagramChartService: data is not loaded.');
    }
  }
}
