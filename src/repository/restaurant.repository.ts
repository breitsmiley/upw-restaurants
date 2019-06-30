import { EntityRepository, Repository } from 'typeorm';
import { RestaurantEntity } from "../entity";

@EntityRepository(RestaurantEntity)
export class RestaurantRepository extends Repository<RestaurantEntity> {

}
