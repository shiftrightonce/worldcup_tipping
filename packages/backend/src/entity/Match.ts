import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Country } from "./Country";
import { Tip } from "./Tip";

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

  @ManyToOne(() => Country, { nullable: true, eager: true })
  countryA: Country;

  @ManyToOne(() => Country, { nullable: true, eager: true })
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

  @ManyToOne(() => Country, (winner) => winner.wins, { nullable: true, eager: true })
  winner: Country;

  @Column({ type: 'date', nullable: true })
  toConfigureOn: Date;

  setDateAndTime (date: string, time: string): this {
    const dt = new Date(new Date(`${date}T${time}`).toUTCString());
    this.date = dt;
    this.time = `${dt.getUTCHours()}:${dt.getUTCMinutes()}`;
    return this;
  }

  @OneToMany(() => Tip, (tip) => tip.match)
  tips: Tip[]


  public getLooser () {
    if (this.winner) {
      return (this.winner.internalId === this.countryA.internalId) ? this.countryB : this.countryA;
    }

    return null
  }
}