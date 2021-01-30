import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Duration } from "../embedded/Duration";
import { ActivityLog } from "./ActivityLog";

@Entity()
export class TransactionLog {

    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(type => Task, { nullable: false })
    // @JoinColumn()
    // task: Task;

    @ManyToOne(type => ActivityLog, { nullable: false })
    @JoinColumn()
    taskActivity: ActivityLog;

    @Column(type => Duration, {prefix: false})
    duration: Duration;

    // @Column({ nullable: false })
    // status: Status = Status.IN_PROGRESS;

    constructor() {
        this.duration = new Duration();
    }
}

// export enum Status {
//     IN_PROGRESS = 'IN_PROGRESS',
//     COMMITTED = 'COMMITTED',
//     ROLLED_BACK = 'ROLLED_BACK',
//     UNKNOWN = 'UNKNOWN'
// }