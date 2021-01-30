import { Column } from "typeorm";

export class Name {

    @Column()
    firstName: string;

    @Column()
    lastName: string;
}