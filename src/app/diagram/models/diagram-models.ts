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