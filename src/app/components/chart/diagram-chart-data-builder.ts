import { Station, TrainType, TimetableRow } from '../../services/diagram-data-loader-service';
import { ChartData } from 'chart.js';

export class DiagramChartDataBuilder {
  public static buildData(
    stations: Station[],
    trainTypes: TrainType[],
    timetable: TimetableRow[]
  ): ChartData<'line'> {
    console.log('stations:', stations);
    console.log('trainTypes:', trainTypes);
    console.log('timetable:', timetable);
    return { datasets: [
      { label: 'dummy', data: [{ x: 0, y: 0 }, { x: 12, y: 15 }, { x: 28, y: 28 }], borderColor: 'blue' },
      { label: 'dummy', data: [{ x: 1, y: 0 }, { x: 15, y: 9 }, { x: 27, y: 25 }], borderColor: 'lime' },
      { label: 'dummy', data: [{ x: 2, y: 0 }, { x: 13, y: 9 }, { x: 26, y: 28 }], borderColor: 'red' }
    ]};
  }
}
