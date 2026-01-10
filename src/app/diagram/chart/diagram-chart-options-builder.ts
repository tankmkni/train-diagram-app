import { ChartOptions } from 'chart.js';
import { TimetableRow } from '../models/diagram-models';
import { DiagramChartAxisManagerService, AxisMode } from './diagram-chart-axis-manager-service';

export class DiagramChartOptionsBuilder {

  public static buildOptions(
    distanceToStationName: Map<number, string>,
    timetable: TimetableRow[],
    minutesToHHmm: (minute: number) => string,
    HHmmToMinutes: (time: string) => number | null,
    axisManager: DiagramChartAxisManagerService
  ): ChartOptions<'line'> {

    const timeAxisRange = DiagramChartOptionsBuilder.getTimeAxisRange(timetable, HHmmToMinutes);
    const isTimeX = axisManager.getAxisMode() === AxisMode.TimeX_StationY;

    return {
      responsive: true,
      scales: {
        // x軸
        x: isTimeX
          ? {
              type: 'linear',
              min: timeAxisRange.min - 1,
              max: timeAxisRange.max,
              ticks: {
                stepSize: 1,
                callback: function(this, tickValue: string | number) {
                  const v = typeof tickValue === 'number' ? tickValue : Number(tickValue);
                  return minutesToHHmm(v);
                }
              }
            }
          : {
              type: 'linear',
              min: 0,
              max: Math.max(...distanceToStationName.keys()),
              reverse: axisManager.isStationReverse(),
              ticks: {
                stepSize: 0.1,
                callback: function(this, tickValue: string | number) {
                  const v = typeof tickValue === 'number' ? tickValue : Number(tickValue);
                  const rounded = Number(v.toFixed(1));
                  return distanceToStationName.get(rounded);
                }
              }
            },

        // y軸
        y: isTimeX
          ? {
              type: 'linear',
              min: 0,
              max: Math.max(...distanceToStationName.keys()),
              reverse: axisManager.isStationReverse(),
              ticks: {
                stepSize: 0.1,
                callback: function(this, tickValue: string | number) {
                  const v = typeof tickValue === 'number' ? tickValue : Number(tickValue);
                  const rounded = Number(v.toFixed(1));
                  return distanceToStationName.get(rounded);
                }
              }
            }
          : {
              type: 'linear',
              min: timeAxisRange.min - 1,
              max: timeAxisRange.max,
              reverse: true,
              ticks: {
                stepSize: 1,
                callback: function(this, tickValue: string | number) {
                  const v = typeof tickValue === 'number' ? tickValue : Number(tickValue);
                  return minutesToHHmm(v);
                }
              }
            }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const xValue = context.parsed.x;
              const yValue = context.parsed.y;

              if (xValue == null || yValue == null) return '';

              // 軸モードに応じて駅名と時間を逆に解釈
              const point = isTimeX
                ? { time: xValue, distance: yValue }
                : { time: yValue, distance: xValue };

              const roundedDistance = Number(point.distance.toFixed(1));
              const stationName = distanceToStationName.get(roundedDistance) ?? `${roundedDistance} km`;
              const time = minutesToHHmm(point.time);

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
      .flatMap(t => [HHmmToMinutes(t.arrivalTime), HHmmToMinutes(t.departureTime)])
      .filter((v): v is number => v !== null);

    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }
}