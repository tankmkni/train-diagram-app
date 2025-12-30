import { Station, TrainType, TimetableRow } from '../../services/diagram-data-loader-service';
import { ChartOptions, ScriptableScaleContext } from 'chart.js';

export class DiagramChartOptionsBuilder {

    public static buildOptions(
    stations: Station[],
    trainTypes: TrainType[],
    timetable: TimetableRow[]
    ): ChartOptions<'line'> {
    // ← 今ここはダミーでOK
    // return { responsive: true };
        return {
            responsive: true,
            scales: { 
                x: { type: 'linear', min: 0, max: 1 }, 
                y: { type: 'linear', min: 0, max: 1 } 
            },
            plugins: {legend: {display: false}}
        };
    }

    // static create(params: {
    //     stations: Station[];
    //     startMinute: number;
    //     endMinute: number;
    //     totalDistanceKm: number;
    // }): ChartOptions<'line'> {
    //     return {
    //         responsive: true,
    //         scales: {
    //         x: this.createDistanceScale(params),
    //         y: this.createTimeScale(params)
    //         },
    //         plugins: {
    //         legend: { display: false }
    //         }
    //     };
    // }

    static create(): ChartOptions<'line'> {
        return {responsive: true,
                scales: {x: {type: 'linear'}, y: {type: 'linear'}},
                plugins: {legend: {display: false}}
        };
    }


    static createDistanceScale(params: {
        stations: Station[];
        startMinute: number;
        endMinute: number;
        totalDistanceKm: number;
    }): NonNullable<ChartOptions<'line'>['scales']>[string] {
        const stationDistances = params.stations.map(s => s.distanceKm);

        return {
            type: 'linear',
            min: 0,
            max: params.totalDistanceKm,

            ticks: {
            stepSize: 0.1,
            callback: () => '' // 通常の数値目盛は表示しない
            },

            grid: {
            drawTicks: false,
            color: (ctx: ScriptableScaleContext) => {
                const v = ctx.tick?.value as number;
                return stationDistances.includes(v)
                ? 'rgba(0,0,0,0.5)'  // 駅位置のみ線を出す
                : 'rgba(0,0,0,0)';  // それ以外は非表示
            }
            }
        };
    }

    static createTimeScale(params: {
    stations: Station[];
    startMinute: number;
    endMinute: number;
    totalDistanceKm: number;
    }): NonNullable<ChartOptions<'line'>['scales']>[string] {

    return {
        type: 'linear',
        min: params.startMinute,
        max: params.endMinute,

        ticks: {
        stepSize: 1,
        callback: (v) => DiagramChartOptionsBuilder.toHHmm(v as number)
        },

        grid: {
        color: (ctx: ScriptableScaleContext) => {
            const v = ctx.tick?.value as number;
            return v % 5 === 0
            ? 'rgba(0,0,0,0.4)'   // 5分：実線
            : 'rgba(0,0,0,0.2)';  // 1分：破線
        },
        borderDash: (ctx: ScriptableScaleContext) => {
            const v = ctx.tick?.value as number;
            return v % 5 === 0 ? [] : [4, 4];
        }
        } as any   // ← ★ここを追加
    };
    }

    private static toHHmm(minute: number): string {
        const h = Math.floor(minute / 60);
        const m = minute % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
}
