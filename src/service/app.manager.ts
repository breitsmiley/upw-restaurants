import * as fs from 'fs';
import * as readline from 'readline';
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { createConnection, Connection, getConnection } from "typeorm";
import { IRest, IRestSchedule, IRestTimeGroup } from "../interfaces";
import { RestaurantRepository, WeekdayRepository, ScheduleRepository } from "../repository";
import { RestaurantEntity } from "../entity";

const DEFAULT_CSV_FILE_PATH = `${__dirname}/../db/rest_hours.csv`;

export class AppManager {

  private restData: IRest[] = [];

  constructor() {
    if (!fs.existsSync(DEFAULT_CSV_FILE_PATH)) {
      throw new Error(`File "${DEFAULT_CSV_FILE_PATH}" not found`);
    }
  }

  static provideMysqlConnectionOptions(): MysqlConnectionOptions {
    return {
      name: "default",
      type: "mysql",
      host: "r-db",
      port: 3306,
      username: "rest",
      password: "rest",
      database: "rest",
      synchronize: false,
      logging: true,
      entities: [
        "src/entity/*.entity.{js,ts}"
      ],
      migrations: [
        "src/migration/*.{js,ts}"
      ],
      cli: {
        migrationsDir: 'src/migration'
      },
    };
  }

  private calcSecondsSinceDayStart(line: string): number {
    const [timeLine, meridiem] = line.split(' ');

    let [h, m] = timeLine.split(':');

    const hours = parseInt(h);
    const minutes = m === undefined ? 0 : parseInt(m);

    const meridiemCorrection = meridiem === 'pm' ? 12 * 3600 : 0;

    const result = (hours * 3600 + minutes * 60) + meridiemCorrection;
    return result === 24 * 3600 ? 0 : result;

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
      open: this.calcSecondsSinceDayStart(startLine),
      close: this.calcSecondsSinceDayStart(endLine),
      days: this.parseDaysLine(daysLine)
    };
  }

  private parseScheduleLine(line: string): IRestSchedule {

    const timeGroups: IRestTimeGroup[] = line.split('/').map((value) => {
      return this.parseScheduleTimeGroupLine(value);
    });

    const schedule: IRestSchedule = [
      {dayOfWeekAlias: 'Mon', dayOfWeekNum: 1, open: 0, close: 0},
      {dayOfWeekAlias: 'Tue', dayOfWeekNum: 2, open: 0, close: 0},
      {dayOfWeekAlias: 'Wed', dayOfWeekNum: 3, open: 0, close: 0},
      {dayOfWeekAlias: 'Thu', dayOfWeekNum: 4, open: 0, close: 0},
      {dayOfWeekAlias: 'Fri', dayOfWeekNum: 5, open: 0, close: 0},
      {dayOfWeekAlias: 'Sat', dayOfWeekNum: 6, open: 0, close: 0},
      {dayOfWeekAlias: 'Sun', dayOfWeekNum: 0, open: 0, close: 0},
    ];

    for (const oneTimeGroup of timeGroups) {
      oneTimeGroup.days.forEach((dayOfWeekAlias) => {

        const idx = schedule.findIndex((value) => {
          return value.dayOfWeekAlias === dayOfWeekAlias;
        });

        if (-1 !== idx) {
          schedule[idx].open = oneTimeGroup.open;
          schedule[idx].close = oneTimeGroup.close;
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

  private async loadCSV(csvPath: string): Promise<IRest[]> {

    const data: IRest[] = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(`${csvPath}`)
    });

    for await (const line of rl) {
      data.push(this.parseCsvLine(line));
    }

    // data.forEach(e => {
    //   console.log(e.name, e.schedule, e.scheduleRAW);
    //   console.log('--------------------------------------');
    // });
    this.restData = data;

    return data;

  }

  private getHourAndMinutesFromSeconds(seconds: number) {
    const hIntDec = seconds / 3600;
    const hFloatDec = hIntDec % 1;

    let h = 0, m = hFloatDec * 60;

    if (hIntDec >= 1) {
      h = hIntDec - hFloatDec;
    }

    return [h, m]
  }

  private addLeadingZero(num: number) {

    return num < 10 ? `0${num}` : `${num}`;
  }

  public async findOpenRestaurants(searchDatetime: Date, csvFilename = DEFAULT_CSV_FILE_PATH): Promise<IRest[]> {

    await this.loadCSV(csvFilename);

    const weekDayNum = searchDatetime.getDay();
    const secondsOfDay = searchDatetime.getUTCHours() * 3600 + searchDatetime.getUTCMinutes() * 60 + searchDatetime.getUTCSeconds();

    return this.restData.filter((oneRestData) => {
      const idx = oneRestData.schedule.findIndex((oneDay) => {
        return oneDay.dayOfWeekNum === weekDayNum
          && oneDay.open <= secondsOfDay
          && oneDay.close >= secondsOfDay;
      });
      return -1 !== idx
    });

  }

  public async findOpenRestaurantsInDB(searchDatetime: Date): Promise<RestaurantEntity[]> {

    const weekDayNum = searchDatetime.getDay();
    const hours = searchDatetime.getUTCHours();
    const minutes = searchDatetime.getUTCMinutes();
    const seconds = searchDatetime.getUTCSeconds();

    const time = `${this.addLeadingZero(hours)}:${this.addLeadingZero(minutes)}:${this.addLeadingZero(seconds)}`;

    const conn = getConnection();
    const restaurantRepository = conn.getCustomRepository(RestaurantRepository);

    return await restaurantRepository.findOpened(weekDayNum, time);
  }

  /**
   * TODO improve performance by bulk insert
   */
  public async migrateFromCsvToDb() {

    const restData = await this.loadCSV(DEFAULT_CSV_FILE_PATH);

    const conn = getConnection();
    const restaurantRepository = conn.getCustomRepository(RestaurantRepository);
    const weekdayRepository = conn.getCustomRepository(WeekdayRepository);
    const scheduleRepository = conn.getCustomRepository(ScheduleRepository);

    for (const oneRest of restData) {

      const restEntityObj = await restaurantRepository.add(oneRest.name, oneRest.scheduleRAW);

      for (const oneSchedule of oneRest.schedule) {
        const weekdayEntityObj = await weekdayRepository.findOne({
          shortName: oneSchedule.dayOfWeekAlias
        });

        let [h, m] = this.getHourAndMinutesFromSeconds(oneSchedule.open);
        const openTime = new Date(0, 0, 0, h, m, 0);

        [h, m] = this.getHourAndMinutesFromSeconds(oneSchedule.close);
        const closeTime = new Date(0, 0, 0, h, m, 0);
        await scheduleRepository.add(restEntityObj, weekdayEntityObj, openTime, closeTime)
      }

    }
  }

}
