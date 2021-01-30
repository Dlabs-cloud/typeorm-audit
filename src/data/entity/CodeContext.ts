import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CodeContext {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    fileName: string;
 
    @Column("text")
    methodName: string;

    @Column("text")
    methodSignature: string;

    @Column()
    lineNumber: number;
}