import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, AfterInsert, OneToMany, AfterLoad, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, Generated, OneToOne, Unique } from "typeorm"
import { cleanUsernameForAvatar, generateAvatar, generateToken, hashPassword } from "../service/user_service";
import { ChatMessage } from "./ChatMessage";
import { Scoreboard } from "./Scoreboard";
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

    @Column()
    @Generated('uuid')
    internalId: string;

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

    @Column({ length: 255,  unique: true })
    email: string;

    @Column({ length: 128 })
    password: string;

    @Column({ length: 64 })
    token: string

    @Column({ type: "simple-json", nullable: true })
    data: {
        push_subscription: Record<string, unknown>
    }

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

    // @OneToOne(() => Scoreboard, (score) => score.userId)
    @OneToOne(() => Scoreboard)
    score: Scoreboard;


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
        return this.type === UserType.HUMAN ? `/static/user/${cleanUsernameForAvatar(this.username)}.png` : '/static/chat/bot.png';
    }
    setData (key: string, value: unknown) {
        if (this.data === null) {
            this.data = {
                push_subscription: null
            }
        }
        this.data[key] = value

        return this
    }

    getData (key: string): unknown {
        if (this.data && this.data[key] !== undefined) {
            return this.data[key];
        }
        return this.data;
    }

    removeData (key: string) {
        if (this.data && this.data[key]) {
            delete this.data[key]
        }
        return this
    }
}
