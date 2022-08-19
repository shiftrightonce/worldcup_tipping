import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChatRoom } from "./ChatRoom";
import { User } from "./User";

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

  @ManyToOne(() => ChatRoom, (room) => room.messages, { nullable: false })
  room: ChatRoom;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}