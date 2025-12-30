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
    return { datasets: [{ label: 'dummy', data: [{ x: 0, y: 0 }, { x: 1, y: 1 }], borderColor: 'blue' }] };
  }
}
