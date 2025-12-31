import { Station, TrainType, TimetableRow } from '../../services/diagram-data-loader-service';
import { ChartOptions } from 'chart.js';

export class DiagramChartOptionsBuilder {

    public static buildOptions(
        stations: Station[],
        trainTypes: TrainType[],
        timetable: TimetableRow[]
    ): ChartOptions<'line'> {

        // 距離 → 駅名の対応表を作る
        const distanceToStationName = DiagramChartOptionsBuilder.getDistanceToStationMap(stations);

        return {
            responsive: true,
            scales: { 
                x: {
                    type: 'linear',
                    min: 0, max: Math.max(...Array.from(distanceToStationName.keys())),
                    ticks: {
                        stepSize: 0.1,   // 0.1刻みにする
                        callback: (value) => {
                            const rounded = Number(value).toFixed(1);  // まず number に変換
                            return distanceToStationName.get(Number(rounded));  // string に戻るので再度 number に
                        }
                    }
                },
                y: {
                    type: 'linear',
                    min: 0, max: Math.max(...Array.from(distanceToStationName.keys())),
                    ticks: {
                        stepSize: 0.1,   // 0.1刻みにする
                        callback: (value) => {
                            const rounded = Number(value).toFixed(1);  // まず number に変換
                            return distanceToStationName.get(Number(rounded));  // string に戻るので再度 number に
                        }
                    }
                } 
            },
            plugins: {legend: {display: false}}
        };
    }


    private static getDistanceToStationMap(stations: Station[]): Map<number, string> {
        const map = new Map<number, string>();
        let sum = 0;
        for (const s of stations) {
            sum += s.distanceKm;
            map.set(Number(sum.toFixed(1)), s.name); // 小数第一位で丸めて登録
        }
        return map;
    }




    private static toHHmm(minute: number): string {
        const h = Math.floor(minute / 60);
        const m = minute % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
}
