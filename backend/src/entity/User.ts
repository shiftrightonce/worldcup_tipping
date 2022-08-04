import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm"
import { generateToken, hashPassword } from "../service/user_service";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 255 })
    username: string

    @Column({ length: 255, default: ''})
    email: string;

    @Column({length: 128 })
    password: string;

    @Column({length: 64 })
    token: string

}
