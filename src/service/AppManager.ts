import * as fs from 'fs';
import * as readline from 'readline';
import { IRest, IRestSchedule, IRestScheduleWorkTime, IRestTimeGroup } from "../interfaces";

const DB_DIR = '/app/src/db';

export class AppManager {

  private restData: IRest[] = [];

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
      if (part.includes("-")) {
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

    const schedule: IRestSchedule = {
      Mon: {start: 0, end: 0},
      Tue: {start: 0, end: 0},
      Wed: {start: 0, end: 0},
      Thu: {start: 0, end: 0},
      Fri: {start: 0, end: 0},
      Sat: {start: 0, end: 0},
      Sun: {start: 0, end: 0},
    };

    for (const oneTimeGroup of timeGroups) {
      oneTimeGroup.days.forEach((value) => {
        if (schedule.hasOwnProperty(value)) {
          schedule[value].start = oneTimeGroup.start;
          schedule[value].end = oneTimeGroup.end;
        }
      });
    }

    return schedule
  }

  private parseLine(line: string): IRest  {

    const [name, scheduleLine] = line
      .replace(/^"+|"+$/g, '')
      .split(/","/);

    return {
      name: name,
      schedule: this.parseScheduleLine(scheduleLine),
      scheduleRAW: line
    }
  }

  public loadCSV(csvPath: string) {

    const rl = readline.createInterface({
      input: fs.createReadStream(`${csvPath}`)
    });

    rl.on('line', (line) => {
        this.restData.push(this.parseLine(line));
    });

    rl.on('close', (line) => {
      this.restData.forEach(e => {
        console.log(e.name, e.schedule, e.scheduleRAW);
        console.log('--------------------------------------');
      });
    });

  }

}
