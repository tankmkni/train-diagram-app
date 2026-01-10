import { Station, TrainType, TimetableRow } from '../models/diagram-models';
import { ChartData, ChartDataset } from 'chart.js';
import { DiagramChartAxisManagerService } from './diagram-chart-axis-manager-service';
import { POINT_KIND } from '../models/diagram-models';

export class DiagramChartDataBuilder {

  public static buildData(
    stations: Station[],
    trainTypes: TrainType[],
    timetable: TimetableRow[],
    getColor: (trainTypeId: string) => string,
    axisManager: DiagramChartAxisManagerService
  ): ChartData<'line'> {

    const stationDistanceMap = this.buildStationDistanceMap(stations);
    const datasets: ChartDataset<'line'>[] = [];

    for (let i = 0; i < timetable.length - 1; i++) {
      const current = timetable[i];
      const next = timetable[i + 1];

      // 列車が違うなら線を引かない
      if (current.trainId !== next.trainId) continue;

      // 時刻が欠けている場合はスキップ
      if (current.departureTime === '---' || next.arrivalTime === '---') continue;

      const x1 = this.HHmmToMinutes(current.departureTime);
      const x2 = this.HHmmToMinutes(next.arrivalTime);
      if (x1 == null || x2 == null) continue;

      const y1 = stationDistanceMap.get(current.stationId);
      const y2 = stationDistanceMap.get(next.stationId);
      if (y1 == null || y2 == null) continue;

      const point1 = axisManager.buildPoint(x1, y1, POINT_KIND.DEP);
      const point2 = axisManager.buildPoint(x2, y2, POINT_KIND.ARR);

      datasets.push({
        label: timetable[i].trainId,  
        data: [point1, point2],
        fill: false,
        borderWidth: 3,
        pointRadius: 1,
        pointHoverRadius: 10,
        borderColor: getColor(current.trainTypeId)
      });
    }

    return { datasets };
  }

  /**
   * stationId → 累積距離
   */
  private static buildStationDistanceMap(stations: Station[]): Map<string, number> {
    const map = new Map<string, number>();
    let sum = 0;
    for (const s of stations) {
      sum += s.distanceKm;
      map.set(s.id, Number(sum.toFixed(1)));
    }
    return map;
  }

  /**
   * "HH:mm" → 分
   */
  private static HHmmToMinutes(time: string): number | null {
    if (time === '---') return null;
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }
}
