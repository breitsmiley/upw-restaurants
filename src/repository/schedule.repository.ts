import { EntityRepository, Repository } from 'typeorm';
import { RestaurantEntity, ScheduleEntity, WeekdayEntity } from "../entity";

@EntityRepository(ScheduleEntity)
export class ScheduleRepository extends Repository<ScheduleEntity> {
  async add(
    restaurant: RestaurantEntity,
    weekday: WeekdayEntity,
    open: Date,
    close: Date,
  ): Promise<ScheduleEntity> {

    const entity = new ScheduleEntity();
    entity.restaurant = restaurant;
    entity.weekday = weekday;
    entity.open = open;
    entity.close = close;

    return await this.save(entity);
  }
}
