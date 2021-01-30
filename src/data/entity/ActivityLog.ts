import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Duration } from "../embedded/Duration";
import { CodeContext } from "./CodeContext";
import { TransactionLog } from "./TransactionLog";
import { WebRequest } from "./WebRequest";

@Entity()
export class ActivityLog {

    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(type => Task, { nullable: false })
    // @JoinColumn()
    // task: Task;

    @ManyToOne(type => WebRequest, webRequest => webRequest.activity)
    @JoinColumn()
    webRequest: WebRequest;

    @ManyToOne(type => ActivityLog)
    @JoinColumn()
    parentActivity: ActivityLog;

    @ManyToOne(type => TransactionLog)
    @JoinColumn()
    transaction: TransactionLog;

    @Column({ nullable: false })
    name: string;

    @Column("text", { nullable: true })
    description: string;

    @Column({ nullable: false })
    depth: number = 1;

    @ManyToOne(type => CodeContext)
    @JoinColumn()
    entryPoint: CodeContext;

    @Column(type => Duration, {prefix: false})
    duration: Duration;

    // @ManyToOne
    // private Failure failure;

    @Column({ nullable: false })
    status: Status = Status.IN_PROGRESS;

    constructor(name: string, description?: string) {
        this.duration = new Duration();
        this.name = name;
        this.description = description;
    }
}

export enum Status {
    SUCCESSFUL = 'SUCCESSFUL',
    FAILED = 'FAILED',
    IN_PROGRESS = 'IN_PROGRESS'
}