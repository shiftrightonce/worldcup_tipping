import { ViewColumn, ViewEntity, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { year as configYear } from "../games/parser"
import { cleanUserData } from "../service/user_service";
import { User } from "./User";

@ViewEntity({
  expression: `select userId, sum(points) as totalPoints, rank() over (order by totalPoints desc) as position, year from tip 
 where year = ${configYear} group by userId`
})
export class Scoreboard {

  @ViewColumn()
  totalPoints: number;

  @ViewColumn()
  position: number;

  @ViewColumn()
  year: number

  @ManyToOne(() => User, { eager: true })
  user: User;

  public toDto () {
    return {
      year: this.year,
      totalPoints: this.totalPoints,
      position: this.position,
      user: cleanUserData(this.user, ['id'])
    };
  }
}