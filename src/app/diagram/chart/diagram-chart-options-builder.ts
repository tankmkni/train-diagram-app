import { ChartOptions } from 'chart.js';
import { TimetableRow } from '../models/diagram-models';

export class DiagramChartOptionsBuilder {

  public static buildOptions(
    distanceToStationName: Map<number, string>,
    timetable: TimetableRow[],
    minutesToHHmm: (minute: number) => string,
    HHmmToMinutes: (time: string) => number | null
  ): ChartOptions<'line'> {

    const timeAxisRange: {min: number, max: number} = DiagramChartOptionsBuilder.getTimeAxisRange(
      timetable,
      HHmmToMinutes
    );

    return {
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: Math.max(...distanceToStationName.keys()),
          ticks: {
            stepSize: 0.1,
            callback: (value) => {
              const rounded = Number(Number(value).toFixed(1));
              return distanceToStationName.get(rounded);
            }
          }
        },
        y: {
          type: 'linear',
          min: timeAxisRange.min - 1,
          max: timeAxisRange.max,
          reverse: true,  // 下→上の表示順を反転
          ticks: {
            stepSize: 1,
            callback: (value) => minutesToHHmm(Number(value))
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const xValue = context.parsed.x;
              const yValue = context.parsed.y;
              
              if (xValue == null || yValue == null) {
                return '';
              }

              // 距離 → 駅名
              const roundedX = Number(xValue.toFixed(1));
              const stationName =
              distanceToStationName.get(roundedX) ?? `${roundedX} km`;

              // 分 → HH:mm
              const time = minutesToHHmm(yValue);

              return `${stationName} / ${time}`;
            }
          }
        }
      }
    };
  }

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
}