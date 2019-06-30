import * as fs from 'fs';
import * as readline from 'readline';
import { IRest, IRestSchedule, IRestScheduleWorkTime, IRestTimeGroup } from "../interfaces";

const DEFAULT_CSV_FILE_PATH = `${__dirname}/../db/rest_hours.csv`;

export class AppManager {

  private restData: IRest[] = [];

  constructor() {
    if (!fs.existsSync(DEFAULT_CSV_FILE_PATH)) {
      throw new Error(`File "${DEFAULT_CSV_FILE_PATH}" not found`);
    }
  }

  private calcSecondsSinceDayStart(line: string): number {
    const [timeLine, meridiem] = line.split(' ');

    let [h, m] = timeLine.split(':');

    const hours = parseInt(h);
    const minutes = m === undefined ? 0 : parseInt(m);

    const meridiemCorrection = meridiem === 'pm' ? 12 * 3600 : 0;
    return (hours * 3600 + minutes * 60) + meridiemCorrection;

  }

  private parseDaysLine(line: string) {

    const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const dayParts = line.split(', ');

    const days = [];
    for (let part of dayParts) {
      if (part.includes('-')) {
        const [dayStart, dayEnd] = part.split('-');

        const startIdx = WEEK_DAYS.indexOf(dayStart);
        const endIdx = WEEK_DAYS.indexOf(dayEnd);

        days.push(
          ...WEEK_DAYS.slice(startIdx, endIdx + 1)
        );

      } else {
        days.push(part);
      }
    }

    return days;
  }

  private parseScheduleTimeGroupLine(line: string): IRestTimeGroup {

    const {daysLine, startLine, endLine} = line
      .trim()
      .match(/^(?<daysLine>.*) (?<startLine>\d{1,2}(:\d{1,2})? (am|pm)) - (?<endLine>\d{1,2}(:\d{1,2})? (am|pm))$/)
      .groups;

    return {
      start: this.calcSecondsSinceDayStart(startLine),
      end: this.calcSecondsSinceDayStart(endLine),
      days: this.parseDaysLine(daysLine)
    };
  }

  private parseScheduleLine(line: string): IRestSchedule {

    const timeGroups: IRestTimeGroup[] = line.split('/').map((value) => {
      return this.parseScheduleTimeGroupLine(value);
    });

    const schedule: IRestSchedule = [
      {dayOfWeekAlias: 'Mon', dayOfWeekNum: 1, start: 0, end: 0},
      {dayOfWeekAlias: 'Tue', dayOfWeekNum: 2, start: 0, end: 0},
      {dayOfWeekAlias: 'Wed', dayOfWeekNum: 3, start: 0, end: 0},
      {dayOfWeekAlias: 'Thu', dayOfWeekNum: 4, start: 0, end: 0},
      {dayOfWeekAlias: 'Fri', dayOfWeekNum: 4, start: 0, end: 0},
      {dayOfWeekAlias: 'Sat', dayOfWeekNum: 6, start: 0, end: 0},
      {dayOfWeekAlias: 'Sun', dayOfWeekNum: 0, start: 0, end: 0},
    ];

    for (const oneTimeGroup of timeGroups) {
      oneTimeGroup.days.forEach((dayOfWeekAlias) => {

        const idx = schedule.findIndex((value) => {
          return value.dayOfWeekAlias === dayOfWeekAlias;
        });

        if (-1 !== idx) {
          schedule[idx].start = oneTimeGroup.start;
          schedule[idx].end = oneTimeGroup.end;
        }
      });
    }

    return schedule
  }

  private parseCsvLine(line: string): IRest {

    const [name, scheduleLine] = line
      .replace(/^"+|"+$/g, '')
      .split(/","/);

    return {
      name: name,
      schedule: this.parseScheduleLine(scheduleLine),
      scheduleRAW: line
    }
  }

  private async loadCSV(csvPath: string) {

    this.restData = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(`${csvPath}`)
    });

    for await (const line of rl) {
      this.restData.push(this.parseCsvLine(line));
    }

    // this.restData.forEach(e => {
    //   console.log(e.name, e.schedule, e.scheduleRAW);
    //   console.log('--------------------------------------');
    // });

  }

  public async findOpenRestaurants(searchDatetime: Date, csvFilename = DEFAULT_CSV_FILE_PATH): Promise<string[]> {

    await this.loadCSV(csvFilename);

    const weekDayNum = searchDatetime.getDay();
    const secondsOfDay = searchDatetime.getHours() * 3600 + searchDatetime.getMinutes() * 60 + searchDatetime.getSeconds();

    return this.restData.filter((oneRestData) => {
      const idx = oneRestData.schedule.findIndex((oneDay) => {
        return oneDay.dayOfWeekNum === weekDayNum
          && oneDay.start < secondsOfDay
          && oneDay.end > secondsOfDay;
      });
      return -1 !== idx
    }).map(element => element.scheduleRAW);

  }

}
