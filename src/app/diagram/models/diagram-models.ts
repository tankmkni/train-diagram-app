export interface Station {
  id: string;
  name: string;
  distanceKm: number;
  operationKm: number;
}

export interface TrainType {
  id: string;
  name: string;
  color: string;
}

export interface TimetableRow {
  trainId: string;
  trainTypeId: string;
  originStation: string;
  destinationStation: string;
  stationId: string;
  arrivalTime: string;    // "08:31"
  departureTime: string;  // "08:33"
}

export enum AxisMode {
  TimeX_StationY,
  StationX_TimeY
}

export const POINT_KIND = {
  DEP: 'dep',
  ARR: 'arr'
} as const;
export type PointKind =
  typeof POINT_KIND[keyof typeof POINT_KIND];

export type DiagramPoint = {
  x: number;
  y: number;
  kind: PointKind;
};
