import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ActivityLog } from "./ActivityLog";

@Entity()
export class WebRequest {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    clientId: string;
    @Column()
    userId: string;
    @Column()
    sessionId: string;
    @Column()
    ipAddress: string;

    @Column("text")
    userAgent: string;

    @Column()
    httpMethod: string;

    @Column("text")
    uri: string;

    @Column()
    scheme: string;
    @Column()
    host: string;
    @Column()
    path: string;

    @Column()
    statusCode: number;

    @OneToOne(type => ActivityLog, activityLog => activityLog.webRequest)
    @JoinColumn()
    activity: ActivityLog;
}