import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity("user")
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    uuid!: string;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    refreshToken!: string;

}
