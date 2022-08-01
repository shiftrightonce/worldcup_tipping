import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, ManyToMany } from "typeorm"
import { Country } from "./Country";

export enum MatchStatus {
  PENDING = 'pending', // The match is not ready for anything
  OPEN = 'open', // The match is open for tipping
  CLOSE = 'close', // The match is close for tipping
  SCORE_ENTERED = 'score_entered', // Final scores entered and it is time to calculate users points
  COMPLETED = 'completed' // Match is and everything around it is completed
}

export enum MatchRound {
  GROUP = 'group',
  ROUND_16 = 'round_16',
  ROUND_8 = 'round_8',
  ROUND_4 = 'round_4',
  THIRD_PLACE = 'third_place',
  FINAL = 'final'
}

@Entity()
export class Match {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.PENDING
  })
  status: MatchStatus; // the status for this match

  @Column()
  year: number; // the year of the match

  @Column()
  number: number; // match number

  @Column({ type: 'date' })
  date: Date; // date of the match

  @Column({ type: 'time' })
  time: string; // time of the match

  @Column({
    type: 'enum',
    enum: MatchRound
  })
  round: MatchRound;

  @Column({ length: 128 })
  match: string; // match as a string eg: A1 vs A2

  @ManyToMany(() => Country, { nullable: true } )
  @JoinColumn()
  countryA: Country;

  @ManyToMany(() => Country, { nullable: true } )
  @JoinColumn()
  countryB: Country;

  @Column({ default: false })
  penalty: boolean; // game can go into penalty

  @Column({ default: 0 })
  countryAGoals: number;

  @Column({ default: 0 })
  countryBGoals: number;

  @Column({ default: 0 })
  countryAPenaltyGoals: number;

  @Column({ default: 0 })
  countryBPenaltyGoals: number; 

  @ManyToMany(() => Country, { nullable: true } )
  @JoinColumn()
  winner: Country; 

  @Column({ type: 'date', nullable: true })
  toConfigureOn: Date
}