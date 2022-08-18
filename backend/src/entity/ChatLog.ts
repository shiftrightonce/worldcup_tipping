import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ChatLog {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 0
  })
  from: number

  @Column({
    length: 512
  })
  message: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}