import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Country {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2 })
  internalId: string;

  @Column()
  year: number;

  @Column()
  name: string;

  @Column({ length: 5 })
  short: string;

  @Column({ default: 0 })
  groupPoints: number;

  @Column()
  image: string;

}