import { AppManager } from "./service/AppManager";

const appManager = new AppManager();


appManager.loadCSV('/app/src/db/rest_hours.csv');
