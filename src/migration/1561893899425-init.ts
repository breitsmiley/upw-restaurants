import {MigrationInterface, QueryRunner} from "typeorm";
import { AppManager } from "../service/AppManager";
const appManager = new AppManager();

export class init1561893899425 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("CREATE TABLE `restaurant` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(64) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    await queryRunner.query("CREATE TABLE `weekday` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(16) NOT NULL, `shortName` char(3) NOT NULL, `orderNum` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    await queryRunner.query("CREATE TABLE `schedule` (`id` int NOT NULL AUTO_INCREMENT, `open` time NOT NULL, `close` time NOT NULL, `restaurantId` int NULL, `weekdayId` int NULL, UNIQUE INDEX `UQ_REST_WEEKDAY` (`restaurantId`, `weekdayId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    await queryRunner.query("ALTER TABLE `schedule` ADD CONSTRAINT `FK_c69f51bc758fff79f17b652a94b` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE `schedule` ADD CONSTRAINT `FK_fd279c4a3685dbfb0fca9abb3c7` FOREIGN KEY (`weekdayId`) REFERENCES `weekday`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    await this.postUp(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("ALTER TABLE `schedule` DROP FOREIGN KEY `FK_fd279c4a3685dbfb0fca9abb3c7`");
    await queryRunner.query("ALTER TABLE `schedule` DROP FOREIGN KEY `FK_c69f51bc758fff79f17b652a94b`");
    await queryRunner.query("DROP INDEX `UQ_REST_WEEKDAY` ON `schedule`");
    await queryRunner.query("DROP TABLE `schedule`");
    await queryRunner.query("DROP TABLE `weekday`");
    await queryRunner.query("DROP TABLE `restaurant`");
  }

  private async postUp(queryRunner: QueryRunner): Promise<any> {

    // ... Project Color
    //--------------------------------
    const weekdaySQL = 'INSERT INTO `weekday` (`name`, `shortName`, `orderNum`) VALUES ' +
      `('Monday','Mon', 1), ` +
      `('Tuesday','Tue', 2), ` +
      `('Wednesday','Wed', 3), ` +
      `('Thursday','Thu', 4), ` +
      `('Friday','Fri', 5), ` +
      `('Saturday','Sat', 6), ` +
      `('Sunday','Sun', 0)`;

    await queryRunner.query(weekdaySQL);
    await appManager.migrateFromCsvToDb();
  }
}
