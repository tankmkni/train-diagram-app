import { ChartOptions } from 'chart.js';
import { TimetableRow } from '../models/diagram-models';
import { AxisMode, PointKind, POINT_KIND } from '../models/diagram-models';


export class DiagramChartOptionsBuilder {

  /**
   * chart.js 用のオプション(xy軸表示等)を作成
   */
  public static buildOptions(
    timetable: TimetableRow[],
    HHmmToMinutes: (time: string) => number | null,
    getAxisMode: () => AxisMode,
    minutesToHHmm: (minute: number) => string,
    distanceToStationName: Map<number, string>,
    isStationReverse: () => boolean
  ): ChartOptions<'line'> {

    const timeAxisRange =
      DiagramChartOptionsBuilder.getTimeAxisRange(timetable, HHmmToMinutes);

    const isTimeX =
      getAxisMode() === AxisMode.TimeX_StationY;

    const timeAxis = DiagramChartOptionsBuilder.buildTimeAxis(
      timeAxisRange.min,
      timeAxisRange.max,
      minutesToHHmm,
      !isTimeX // 時間が縦のときは上→下
    );

    const stationAxis = DiagramChartOptionsBuilder.buildStationAxis(
      distanceToStationName,
      isStationReverse()
    );

    return {
      responsive: true,
      scales: {
        x: isTimeX ? timeAxis : stationAxis,
        y: isTimeX ? stationAxis : timeAxis
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title(contexts) {
              const ctx = contexts[0];
              if (!ctx) return '';

              const point = DiagramChartOptionsBuilder.toTimeDistance(
                ctx.parsed,
                isTimeX
              );
              if (!point) return '';

              const rounded = Number(point.distance.toFixed(1));
              return distanceToStationName.get(rounded) ?? `${rounded} km`;
            },
            label(context) {
              const point = DiagramChartOptionsBuilder.toTimeDistance(
                context.parsed,
                isTimeX
              );
              if (!point) return '';

              const trainId = context.dataset.label;

              const raw = context.raw as { kind?: PointKind };
              const suffix =
                raw.kind === POINT_KIND.DEP ? ' 発' :
                raw.kind === POINT_KIND.ARR ? ' 着' :
                '';

              return trainId + ' - ' + minutesToHHmm(point.time) + suffix;
            }
          }
        }
      }
    };
  }
  
  /**
   * 時間軸定義
   */
  private static buildTimeAxis(
    min: number,
    max: number,
    minutesToHHmm: (minute: number) => string,
    reverse: boolean
  ) {
    return {
      type: 'linear' as const,
      min,
      max,
      reverse,
      ticks: {
        stepSize: 1,
        callback(this: unknown, tickValue: string | number) {
          const v =
            typeof tickValue === 'number'
              ? tickValue
              : Number(tickValue);
          return minutesToHHmm(v);
        }
      }
    };
  }

  /**
   * 駅軸定義
   */
  private static buildStationAxis(
    distanceToStationName: Map<number, string>,
    reverse: boolean
  ) {
    return {
      type: 'linear' as const,
      min: 0,
      max: Math.max(...distanceToStationName.keys()),
      reverse,
      ticks: {
        stepSize: 0.1,
        callback(this: unknown, tickValue: string | number) {
          const v =
            typeof tickValue === 'number'
              ? tickValue
              : Number(tickValue);
          const rounded = Number(v.toFixed(1));
          return distanceToStationName.get(rounded);
        }
      }
    };
  }

  /**
   * 時間軸範囲
   */
  private static getTimeAxisRange(
    timetable: TimetableRow[],
    HHmmToMinutes: (time: string) => number | null
  ): { min: number; max: number } {

    const values = timetable
      .flatMap(t => [
        HHmmToMinutes(t.arrivalTime),
        HHmmToMinutes(t.departureTime)
      ])
      .filter((v): v is number => v !== null);

    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }

  /**
   * パース済みの座標点を、軸の向きに応じて time / distance に変換する
   * @param parsed - x, y の座標値（null の場合あり）
   * @param isTimeX - true の場合は x 軸が時間、false の場合は y 軸が時間
   * @returns time と distance を持つオブジェクト、どちらかが null の場合は null
   */
  private static toTimeDistance(
    parsed: { x: number | null; y: number | null },
    isTimeX: boolean
  ): { time: number; distance: number } | null {

    const { x, y } = parsed;
    if (x == null || y == null) return null;

    return isTimeX
      ? { time: x, distance: y }
      : { time: y, distance: x };
  }
}