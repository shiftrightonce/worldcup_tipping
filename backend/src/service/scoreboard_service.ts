import { MoreThan } from "typeorm";
import { AppDataSource } from "../data-source"
import { Scoreboard } from "../entity/Scoreboard"
import { year as configYear } from "../games/parser"

export const getScoreboardRepo = () => {
  return AppDataSource.getRepository(Scoreboard);
}

export const getUserScore = async (userId: number, year = configYear) => {
  // for some reason, I can't use `findOne` here
  const result = await getScoreboardRepo().find({
    where: {
      totalPoints: MoreThan(0),
      user: {
        id: userId
      },
      year
    }
  });

  return (result.length) ? result.pop().toDto() : null;
}

export const getScoreboard = async (limit = 200, year = configYear) => {
  const result = await getScoreboardRepo().createQueryBuilder('scoreboard')
    .where('scoreboard.year = :year', { year })
    .where('totalPoints > 0')
    .leftJoinAndSelect('scoreboard.user', 'user')
    .orderBy('scoreboard.totalPoints', 'DESC')
    .limit(limit)
    .getMany()

  return result.map((r) => r.toDto());
}