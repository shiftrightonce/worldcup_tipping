import { Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterLoad, DeleteDateColumn } from "typeorm"
import { Match } from "./Match";
import { Tip } from "./Tip";

@Entity()
export class Country {

  imageSource = '';

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

  @DeleteDateColumn()
  deletedAt: Date

  @OneToMany(() => Tip, (tip) => tip.toWin)
  tipWins: Tip[]

  @OneToMany(() => Match, (wins) => wins.winner)
  wins: Match[];

  @AfterLoad()
  public handleAfterLoad() {
    this.imageSource = `/static/flag/${this.image}`;
  }

}