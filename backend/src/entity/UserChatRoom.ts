import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

}