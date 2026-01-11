import { Injectable } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

import { Station, TrainType, TimetableRow, PointKind } from '../models/diagram-models';
import { DiagramChartDataBuilder } from './diagram-chart-data-builder';
import { DiagramChartOptionsBuilder } from './diagram-chart-options-builder';
import { DiagramChartAxisManagerService } from './diagram-chart-axis-manager-service';

@Injectable({
  providedIn: 'root'
})
export class DiagramChartBuilderService {

  private stations: Station[] = [];
  private trainTypes: TrainType[] = [];
  private timetable: TimetableRow[] = [];

  private stationDistanceMap?: Map<string, number>;

  constructor(private axisManager: DiagramChartAxisManagerService){}

  //CSVロード後に一度だけ呼ぶ
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

  // Chart.js 用データ生成
  getChartData(): ChartData<'line'> {
    this.assertLoaded();

    const HHmmToMinutes = (time: string) =>
      this.HHmmToMinutes(time);

    const getStationDistanceMap = () =>
      this.getStationDistanceMap();

    const buildPoint = (x: number, y: number, kind: PointKind) =>
      this.axisManager.buildPoint(x, y, kind);

    const getTrainTypeColor = (trainTypeId: string) =>
      this.getTrainTypeColor(trainTypeId);

    return DiagramChartDataBuilder.buildData(
      this.timetable,
      HHmmToMinutes,
      getStationDistanceMap,
      buildPoint,
      getTrainTypeColor
    );
  }

  // Chart.js 用オプション生成
  getChartOptions(): ChartOptions<'line'> {
    this.assertLoaded();

    const HHmmToMinutes = (time: string) =>
      this.HHmmToMinutes(time);

    const getAxisMode = () =>
      this.axisManager.getAxisMode();

    const minutesToHHmm = (minute: number) =>
      this.minutesToHHmm(minute);

    // stationId → 距離 を name に変換
    const distanceToStationName = new Map<number, string>();
    for (const [id, km] of this.getStationDistanceMap()) {
      const station = this.stations.find(s => s.id === id)!;
      distanceToStationName.set(km, station.name);
    }

    const isStationReverse = () =>
      this.axisManager.isStationReverse();

    return DiagramChartOptionsBuilder.buildOptions(
      this.timetable,
      HHmmToMinutes,
      getAxisMode,
      minutesToHHmm,
      distanceToStationName,
      isStationReverse
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

  // 分 → "HH:mm"
  minutesToHHmm(minute: number): string {
    const h = Math.floor(minute / 60);
    const m = minute % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // stationId → 累積距離
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

  // 列車種別CSVに定義されたラインカラーを取得
  private getTrainTypeColor(trainTypeId: string): string {
    const type = this.trainTypes.find(t => t.id === trainTypeId);
    return type?.color ?? 'black';
  }

  // データ未ロードの場合にエラーを返す
  private assertLoaded(): void {
    if (!this.stations.length || !this.timetable.length) {
      throw new Error('DiagramChartService: data is not loaded.');
    }
  }
}
