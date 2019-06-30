import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { RestaurantEntity } from "./restaurant.entity";
import { WeekdayEntity } from "./weekday.entity";

@Entity({
  engine: 'InnoDB',
  name: 'schedule'
})
@Unique("UQ_REST_WEEKDAY", ["restaurant", "weekday"])
export class ScheduleEntity {

  @PrimaryGeneratedColumn({
    type: 'int'
  })
  id: number;

  @Column({
    type: "time",
  })
  open: Date;

  @Column({
    type: "time",
  })
  close: Date;

  @ManyToOne(type => RestaurantEntity)
  restaurant: RestaurantEntity;

  @ManyToOne(type => WeekdayEntity)
  weekday: WeekdayEntity;
}
