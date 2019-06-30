import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    engine: 'InnoDB',
    name: 'weekday'
})
export class WeekdayEntity {

    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id: number;

    @Column({
        type: 'varchar',
        length: 16
    })
    name: string;

    @Column({
        type: 'char',
        length: 3
    })
    shortName: string;

    @Column({
        type: 'tinyint'
    })
    orderNum: number;
}
