import { AppManager } from "./src/service/AppManager";

const appManager = new AppManager();
export = appManager.provideMysqlConnectionOptions();
