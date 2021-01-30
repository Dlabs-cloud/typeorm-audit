import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    country: string;

    @Column()
    city: string;

    @Column()
    district: string;

    @Column()
    streetName: string;

    @Column()
    houseNumber: string;

}
