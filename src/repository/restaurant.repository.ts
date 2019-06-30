import { EntityRepository, Repository } from 'typeorm';
import { RestaurantEntity } from "../entity";

@EntityRepository(RestaurantEntity)
export class RestaurantRepository extends Repository<RestaurantEntity> {
  async add(
    name: string,
  ): Promise<RestaurantEntity> {

    const entity = new RestaurantEntity();
    entity.name = name;

    return await this.save(entity);
  }
}
