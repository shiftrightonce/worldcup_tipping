import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, AfterInsert } from "typeorm"
import { generateAvatar, generateToken, hashPassword } from "../service/user_service";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @Column({ length: 255 })
    username: string

    @Column({ length: 255, default: '' })
    email: string;

    @Column({ length: 128 })
    password: string;

    @Column({ length: 64 })
    token: string

    @BeforeInsert()
    async handeBeforeInsert () {
        if (this.password) {
            this.password = await hashPassword(this.password);
        }
        this.token = generateToken();
    }

    @AfterInsert()
    async handleAfterInsert () {
        await generateAvatar(this.username)
    }

}
