import { MoreThan } from 'typeorm'
import { AppDataSource } from "../data-source"
import { Match, MatchStatus } from "../entity/Match";

export const getTodayMatches = async () => {
 // const date = new Date();

 // @todo remove after testing.
 const date = new Date('2022-11-21');
  return await AppDataSource.getRepository(Match).findBy({
    date
  })
}

export const getTodayOpenMatches = async () => {
  // const date = new Date();
  // const time = `${date.getUTCHours()}:${date.getUTCMinutes()}:00`;

  //@todo remove after testing. for testing only
  const date = new Date('2022-11-21');
  const time = `10:00:00`;

  return await AppDataSource.getRepository(Match).find({
    where: {
      date,
      status: MatchStatus.OPEN,
      time: MoreThan(time)
    },
    order: {
      number: 'ASC'
    }
  })
}