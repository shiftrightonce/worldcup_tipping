import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum ChatGroupType {
  ONE_TO_ONE = 'one2one',
  MULTIPLE = 'multiple'
}

@Entity()
export class ChatGroup {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 255,
    unique: true
  })
  name: string

  @Column({
    type: 'enum',
    enum: ChatGroupType,
    default: ChatGroupType.MULTIPLE
  })
  type: ChatGroupType
}