import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { ChatRoom } from "./ChatRoom";
import { User } from "./User";

export enum UserChatRoomStatus {

}

@Entity()
export class UserChatRoom {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.chatRooms, { nullable: false } )
  user: User;

  @ManyToOne(() => ChatRoom, (room) => room.members, { nullable: false })
  room: ChatRoom;

  @Column({
    length: 255,
    default: ''
  })
  avatar: string;

}