import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatGroup } from "./ChatGroup";
import { User } from "./User";

@Entity()
export class UserChatGroup {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false } )
  user: User;

  @ManyToOne(() => ChatGroup , { nullable: false } )
  group: ChatGroup

}