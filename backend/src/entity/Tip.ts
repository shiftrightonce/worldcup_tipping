import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, DeleteDateColumn } from "typeorm"
import { Country } from "./Country";
import { Match } from "./Match";
import { User } from "./User";

@Entity()
export class Tip {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @ManyToOne(() => User, { nullable: false })
  user: User

  @ManyToOne(() => Match, (match) => match.tips, { nullable: false, eager: true })
  match: Match

  @ManyToOne(() => Country, (winner) => winner.tipWins, { nullable: true, eager: true })
  toWin: Country

  @Column({ default: false })
  isLevel: boolean;

  @Column({ default: false })
  toPenalty: boolean;

  @Column({ default: 0 })
  countryAToScore: number

  @Column({ default: 0 })
  countryBToScore: number

  @Column({ default: 0 })
  countryAPenaltyToScore: number;

  @Column({ default: 0 })
  countryBPenaltyToScore: number;

  @Column({ default: false })
  entryByBot: boolean; // Bot did this tipping?

  @Column({ default: 0 })
  points: number

  @DeleteDateColumn()
  deletedAt: Date
}