import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramDataLoaderService, Station, TrainType, TimetableRow } from '../../services/diagram-data-loader-service';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-csv-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>CSV Loader</h3>
    <button (click)="getStations()"> 駅マスタ表示 </button>
    <button (click)="getTrainTypes()"> 種別マスタ表示 </button>
    <button (click)="getTimeTable()"> タイムテーブル表示 </button>
    <ul>
      <li *ngFor="let s of timetable$ | async">
        {{s.trainId}} - {{ s.trainTypeId }} - {{ s.destination }} - {{ s.stationId }} - {{ s.arrivalTime }} - {{ s.departureTime }}
      </li>

      <li *ngFor="let s of stations$ | async">
        {{s.id}} - {{ s.name }} - {{ s.distanceKm }} km - {{ s.operationKm }} km
      </li>
      
      <li *ngFor="let s of trainTypes$ | async">
        {{s.id}} - {{ s.name }}
      </li>
    </ul>
  `
})
export class TestCsvLoad {
  stations$?: Observable<Station[]>;
  trainTypes$?: Observable<TrainType[]>;
  timetable$?: Observable<TimetableRow[]>;

  constructor(private csvLoader: DiagramDataLoaderService) {}

  getStations() {
    this.clear();
    this.stations$ = this.csvLoader.getStations();
  }
  getTrainTypes() {
    this.clear();
    this.trainTypes$ = this.csvLoader.getTrainTypes();
  }
  getTimeTable() {
    this.clear();
    this.timetable$ = this.csvLoader.getTimeTable();
  }
  
  private clear() {
    this.stations$ = undefined;
    this.trainTypes$ = undefined;
    this.timetable$ = undefined;
  }
}
