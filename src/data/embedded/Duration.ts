import { Column } from "typeorm";

export class Duration {

    @Column({ nullable: false })
    startedAt: Date;

    @Column({nullable: true})
    nanoSecondsTaken: number;

    constructor() {
        this.startedAt = new Date();
    }
}