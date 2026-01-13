import { DiagramPoint, PointKind, TimetableRow } from '../models/diagram-models';
import { ChartData, ChartDataset } from 'chart.js';
import { POINT_KIND } from '../models/diagram-models';


export class DiagramChartDataBuilder {

  /**
   * Chart.js 用のデータを生成
   */
  public static buildData(
    timetable: TimetableRow[],
    HHmmToMinutes: (time: string) => number | null,
    getStationDistanceMap: () => Map<string, number>,
    buildPoint: (x: number, y: number, kind: PointKind) => DiagramPoint,
    getTrainTypeColor: (trainTypeId: string) => string
  ): ChartData<'line'> {

    const datasets: ChartDataset<'line'>[] = [];

    for (let i = 0; i < timetable.length - 1; i++) {
      const current = timetable[i];
      const next = timetable[i + 1];

      const trainId = timetable[i].trainId;
      const originStation = timetable[i].originStation;
      const destinationStation = timetable[i].destinationStation;
      const labelMessage = `${trainId} (${originStation} > ${destinationStation})`

      // 列車が違うなら線を引かない
      if (current.trainId !== next.trainId) continue;

      // 時刻が欠けている場合はスキップ
      if (current.departureTime === '---' || next.arrivalTime === '---') continue;

      const x1 = HHmmToMinutes(current.departureTime);
      const x2 = HHmmToMinutes(next.arrivalTime);
      if (x1 == null || x2 == null) continue;

      const y1 = getStationDistanceMap().get(current.stationId);
      const y2 = getStationDistanceMap().get(next.stationId);
      if (y1 == null || y2 == null) continue;

      // AxisMode に応じて時間軸と駅軸を入れ替える
      const point1 = buildPoint(x1, y1, POINT_KIND.DEP);
      const point2 = buildPoint(x2, y2, POINT_KIND.ARR);

      datasets.push({
        label: labelMessage,
        data: [point1, point2],
        fill: false,
        borderWidth: 3,
        pointRadius: 1,
        pointHoverRadius: 10,
        borderColor: getTrainTypeColor(current.trainTypeId)
      });
    }

    return { datasets };
  }
}