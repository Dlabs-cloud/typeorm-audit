// import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Duration } from "../embedded/Duration";
// import { WebRequest } from "./WebRequest";

// // @Entity()
// export class Task {

//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({ nullable: false })
//     name: string;

//     @Column({ nullable: false})
//     type: Type;

//     @Column("text", {nullable: true})
//     description: string;

//     @OneToOne(type => WebRequest, webRequest => webRequest.task)
//     @JoinColumn()
//     webRequest: WebRequest;

//     @Column(type => Duration)
//     duration: Duration;

//     // @OneToOne
//     // private Failure failure;
// }

// export enum Type {
//     BACKGROUND_JOB = 'BACKGROUND_JOB',
//     WEB_REQUEST = 'WEB_REQUEST'
// }