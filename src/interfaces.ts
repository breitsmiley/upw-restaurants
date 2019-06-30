export interface IRestScheduleWorkTime {
  dayOfWeekAlias: string;
  dayOfWeekNum: number;
  open: number;
  close: number;
}

export type IRestSchedule = IRestScheduleWorkTime[];

export interface IRest {
  name: string;
  schedule: IRestSchedule;
  scheduleRAW: string;
}

export interface IRestTimeGroup {
  open: number;
  close: number;
  days: string[];
}

export interface IApiFindRestRequestData {
  datetime: string
}
