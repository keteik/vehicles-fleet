import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("vehicle")
export class Vehice extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    uuid!: string;

    @Column()
    type!: string;

    @Column()
    brand!: string;

    @Column()
    model!: string;

    @Column()
    sweptVolume!: string;

    @Column()
    insuranceDate!: Date;

    @Column()
    technicalExaminationDate!: Date
}