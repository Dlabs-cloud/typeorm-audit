import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Name } from "../embedded/Name";
import { Address } from "./Address";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column(type => Name, { prefix: false })
    name: Name = new Name();

    @Column()
    age: number;

    @ManyToOne(type => Address)
    @JoinColumn()
    address: Address;

}
