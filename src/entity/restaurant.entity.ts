import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    engine: 'InnoDB',
    name: 'restaurant'
})
export class RestaurantEntity {

    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id: number;

    @Column({
        type: 'varchar',
        length: 64
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 255
    })
    scheduleRAW: string;
}
