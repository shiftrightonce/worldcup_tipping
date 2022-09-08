import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, AfterInsert, OneToMany, AfterLoad, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { generateAvatar, generateToken, hashPassword } from "../service/user_service";
import { ChatMessage } from "./ChatMessage";
import { UserChatRoom } from "./UserChatRoom";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

export enum UserType {
    HUMAN = 'human',
    BOT = 'bot'
}

@Entity()
export class User {

    avatar = '';

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @Column({
        type: 'enum',
        enum: UserType,
        default: UserType.HUMAN
    })
    type: UserType

    @Column({ length: 255 })
    username: string

    @Column({ length: 255, default: '' })
    email: string;

    @Column({ length: 128 })
    password: string;

    @Column({ length: 64 })
    token: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt?: Date

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

    @AfterLoad()
    handleAfterLoad () {
        // set avatar
        this.avatar = this.getAvatar()
    }

    getAvatar () {
        return this.type === UserType.HUMAN ? `/static/user/${this.username}.png` : '/static/chat/bot.png';
    }
}
