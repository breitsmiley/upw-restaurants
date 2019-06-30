import { EntityRepository, Repository } from 'typeorm';
import { WeekdayEntity } from "../entity";

@EntityRepository(WeekdayEntity)
export class WeekdayRepository extends Repository<WeekdayEntity> {

}
