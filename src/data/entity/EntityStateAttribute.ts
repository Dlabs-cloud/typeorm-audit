import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntityState } from "./EntityState";

@Entity()
export class EntityStateAttribute {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => EntityState, { nullable: false })
    @JoinColumn()
    entityState: EntityState;

    @Column()
    name: string;

    @Column()
    modified: boolean;

    @Column()
    hasPreviousValue: boolean;
    @Column()
    hasNewValue: boolean;

    @Column("text", {nullable: true})
    newValue: string;

    @Column("text", {nullable: true})
    previousValue: string;
}