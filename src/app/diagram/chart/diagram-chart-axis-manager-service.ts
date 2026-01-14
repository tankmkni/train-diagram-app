import { Injectable } from '@angular/core';
import { AxisMode, DiagramPoint, PointKind } from '../models/diagram-models';


@Injectable({
  providedIn: 'root',
})
export class DiagramChartAxisManagerService {

  private axisMode: AxisMode = AxisMode.TimeX_StationY;  // 軸の向き
  private stationReverse = true;  // 駅軸の表示順（true: 反転）

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

  /**
   * AxisMode に応じて、x/y を入れ替えて DiagramPoint を作成
   */
  buildPoint(
    time: number,
    distance: number, 
    kind: PointKind
  ): DiagramPoint  {

    return this.axisMode === AxisMode.TimeX_StationY
      ? { x: time, y: distance, kind }
      : { x: distance, y: time, kind };
  }
}