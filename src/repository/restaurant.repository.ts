import { EntityRepository, Repository } from 'typeorm';
import { RestaurantEntity, ScheduleEntity, WeekdayEntity } from "../entity";

@EntityRepository(RestaurantEntity)
export class RestaurantRepository extends Repository<RestaurantEntity> {
  async add(
    name: string,
    scheduleRAW: string,
  ): Promise<RestaurantEntity> {

    const entity = new RestaurantEntity();
    entity.name = name;
    entity.scheduleRAW = scheduleRAW;

    return await this.save(entity);
  }

  async findOpened(
    weekDayNum: number,
    time: string,
  ) {
    const qb = this.createQueryBuilder('r')
      .innerJoin(ScheduleEntity, 's', 's.restaurantId = r.id')
      .innerJoin(WeekdayEntity, 'w', 's.weekdayId = w.id')
      .where('w.orderNum = :weekDayNum', { weekDayNum: weekDayNum })
      .andWhere('s.open <= :open', { open: time })
      .andWhere('s.close >= :close', { close: time });

    return await qb.getMany();
  }
}
