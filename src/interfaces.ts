export interface IRestScheduleWorkTime {
  start: number;
  end: number;
}

export interface IRestSchedule {
  Mon: IRestScheduleWorkTime;
  Tue: IRestScheduleWorkTime;
  Wed: IRestScheduleWorkTime;
  Thu: IRestScheduleWorkTime;
  Fri: IRestScheduleWorkTime;
  Sat: IRestScheduleWorkTime;
  Sun: IRestScheduleWorkTime;
}

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
