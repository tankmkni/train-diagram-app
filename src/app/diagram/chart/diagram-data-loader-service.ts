import { Injectable } from '@angular/core';
import { CsvLoaderService } from '../../shared/services/csv-loader-service';
import { Observable } from 'rxjs';
import { Station, TimetableRow, TrainType } from '../models/diagram-models';


@Injectable({
  providedIn: 'root',
})
export class DiagramDataLoaderService {

  private readonly csvRoot = 'data';

  constructor(private csvLoader: CsvLoaderService) {}

  getStations(): Observable<Station[]>{
    return this.csvLoader.loadWithoutHeader<Station>(`${this.csvRoot}/stations.csv`, cols => ({
      id: cols[0],
      name: cols[1],
      distanceKm: Number(cols[2]),
      operationKm: Number(cols[3])
    }))
  }

  getTrainTypes(): Observable<TrainType[]>{
    return this.csvLoader.loadWithoutHeader<TrainType>(`${this.csvRoot}/train_types.csv`, cols => ({
      id: cols[0],
      name: cols[1],
      color: cols[2]
    }))
  }

  getTimeTable(): Observable<TimetableRow[]>{
    return this.csvLoader.loadWithoutHeader<TimetableRow>(`${this.csvRoot}/timetable.csv`, cols => ({
      trainId: cols[0],
      trainTypeId: cols[1],
      destination: cols[2],
      stationId: cols[3],
      arrivalTime: cols[4],
      departureTime: cols[5]
    }))
  }
}