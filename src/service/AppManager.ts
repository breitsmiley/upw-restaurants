import * as fs from 'fs';
import * as readline from 'readline';
import { IRest } from "../interfaces";

const DB_DIR = '/app/src/db';

export class AppManager {

  private restData: IRest[] = [];

  public loadCSV(csvPath: string) {

    const line = readline.createInterface({
      input: fs.createReadStream(`${csvPath}`)
    });

    line.on('line', (line) => {
      console.log(line);
    });

  }
}
