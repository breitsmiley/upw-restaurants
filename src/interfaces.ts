export interface IRestScheduleWorkTime {
  dayOfWeekAlias: string;
  dayOfWeekNum: number;
  start: number;
  end: number;
}

export type IRestSchedule = IRestScheduleWorkTime[];

export interface IRest {
  name: string;
  schedule: IRestSchedule;
  scheduleRAW: string;
}

export interface IRestTimeGroup {
  start: number;
  end: number;
  days: string[];
}

export interface IApiFindRestRequestData {
  datetime: string
}
