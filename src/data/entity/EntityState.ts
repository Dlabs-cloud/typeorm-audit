import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OperationType } from "../enum/operation-type.enum";
import { TransactionLog } from "./TransactionLog";

@Entity()
export class EntityState {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => TransactionLog, {nullable: false})
    @JoinColumn()
    taskTransaction: TransactionLog;

    @Column("text", { nullable: false })
    entityName: string;

    @Column({ nullable: false })
    entityId: string;

    @Column({ nullable: false })
    operationType: OperationType;
}