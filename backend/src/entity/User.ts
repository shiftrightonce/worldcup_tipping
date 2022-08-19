import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, AfterInsert, OneToMany } from "typeorm"
import { generateAvatar, generateToken, hashPassword } from "../service/user_service";
import { ChatMessage } from "./ChatMessage";
import { UserChatRoom } from "./UserChatRoom";

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

    @OneToMany(() => ChatMessage, (message) => message.from)
    sentMessages: ChatMessage[]

    @OneToMany(() => UserChatRoom, (room) => room.user)
    chatRooms: UserChatRoom[]

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
