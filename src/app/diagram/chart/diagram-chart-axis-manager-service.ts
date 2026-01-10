import { Injectable } from '@angular/core';

export enum AxisMode {
  TimeX_StationY,
  StationX_TimeY
}

@Injectable({
  providedIn: 'root',
})
export class DiagramChartAxisManagerService {

  private axisMode: AxisMode = AxisMode.TimeX_StationY;  // 軸の向き
  private stationReverse = false;  // 駅軸の表示順（true: 反転）

  toggleAxisMode(): void {
    this.axisMode =
      this.axisMode === AxisMode.TimeX_StationY
        ? AxisMode.StationX_TimeY
        : AxisMode.TimeX_StationY;
  }

  toggleStationReverse(): void {
    this.stationReverse = !this.stationReverse;
  }

  getAxisMode(): AxisMode {
    return this.axisMode;
  }

  isStationReverse(): boolean {
    return this.stationReverse;
  }

  buildPoint(
    time: number,
    distance: number
  ): { x: number; y: number } {

    return this.axisMode === AxisMode.TimeX_StationY
      ? { x: time, y: distance }
      : { x: distance, y: time };
  }
}