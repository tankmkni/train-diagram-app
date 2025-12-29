import { Injectable } from '@angular/core';
import { CsvLoaderService } from './csv-loader.service';
import { Observable, map } from 'rxjs';

export interface Station {
  id: string;
  name: string;
  distanceKm: number;
  operationKm: number;
}

export interface TrainType {
  id: string;
  name: string;
}

export interface TimetableRow {
  trainId: string;
  trainTypeId: string;
  destination: string;
  stationId: string;
  arrivalTime: string;    // "08:31"
  departureTime: string;  // "08:33"
}


@Injectable({
  providedIn: 'root',
})
export class DiagramDataService {

  constructor(private csvLoader: CsvLoaderService) {}

  getStations(): Observable<Station[]>{
    return this.csvLoader.load<Station>('data/stations.csv', cols => ({
      id: cols[0],
      name: cols[1],
      distanceKm: Number(cols[2]),
      operationKm: Number(cols[3])
    }))
  }

  getTrainTypes(): Observable<TrainType[]>{
    return this.csvLoader.load<TrainType>('data/train_types.csv', cols => ({
      id: cols[0],
      name: cols[1]
    }))
  }

  getTimeTable(): Observable<TimetableRow[]>{
    return this.csvLoader.load<TimetableRow>('data/timetable.csv', cols => ({
      trainId: cols[0],
      trainTypeId: cols[1],
      destination: cols[2],
      stationId: cols[3],
      arrivalTime: cols[4],
      departureTime: cols[5]
    }))
  }
}
