export interface IRestScheduleWorkTime {
  start: number;
  end: number;
}

export interface IRestSchedule {
  mon: IRestScheduleWorkTime;
  tue: IRestScheduleWorkTime;
  wed: IRestScheduleWorkTime;
  thu: IRestScheduleWorkTime;
  fri: IRestScheduleWorkTime;
  sat: IRestScheduleWorkTime;
  sun: IRestScheduleWorkTime;
}

export interface IRest {
  name: string;
  schedule: IRestSchedule;
}
