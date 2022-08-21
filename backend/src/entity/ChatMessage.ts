import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChatRoom } from "./ChatRoom";
import { User } from "./User";

export enum ChatMessageType {
  MESSAGE = 'message',
  IMAGE   = 'image',
  VIDEO = 'video'
}

@Entity()
export class ChatMessage {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  from: User;

  @Column({
    length: 512
  })
  message: string;

  @Column({
    type: 'enum',
    enum: ChatMessageType,
    default: ChatMessageType.MESSAGE
  })
  type: ChatMessageType

  @ManyToOne(() => ChatRoom, (room) => room.messages, { nullable: false })
  room: ChatRoom;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}