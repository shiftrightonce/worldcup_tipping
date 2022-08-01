import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { Country } from "./Country";
import { Match } from "./Match";
import { User } from "./User";

@Entity()
export class Tip {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @JoinColumn()
  @OneToOne(() => User)
  user: User 

  @OneToOne(() => Match)
  @JoinColumn()
  match: Match 

  @JoinColumn()
  @OneToOne(() => Country )
  winner: Country

  @Column({ default: false })
  penalty: boolean;

  @Column({ default: 0 })
  countryAGoals: number

  @Column({ default: 0 })
  countryBGoals: number

  @Column({ default: 0 })
  countryAPenaltyGoals: number;

  @Column({ default: 0 })
  countryBPenaltyGoals: number;

  @Column({ default: false })
  bot: boolean; // Bot did this tipping?

  @Column({ default: 0 })
  points: number
}