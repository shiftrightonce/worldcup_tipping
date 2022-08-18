import { MoreThan, MoreThanOrEqual } from 'typeorm'
import { AppDataSource } from "../data-source"
import { Match, MatchStatus } from "../entity/Match";

export const getMatchRepo = () => {
  return AppDataSource.getRepository(Match)
}

export const getTodayMatches = async () => {
  const date = new Date();
  return await getMatchRepo().findBy({
    date
  })
}

export const getTodayOpenMatches = async () => {
  const date = new Date();
  const time = `${date.getUTCHours()}:${date.getUTCMinutes()}:00`;
  return await getMatchRepo().find({
    where: {
      date: MoreThanOrEqual(date),
      status: MatchStatus.OPEN,
      // time: MoreThan(time),
    },
    order: {
      number: 'ASC'
    }
  })

}

export const getMatchesByStatus = async (status: MatchStatus) => {
  return await getMatchRepo().find({
    where: {
      status
    },
    order: {
      number: 'DESC'
    }
  })
}

export const getMatchById = async (matchId: number) => {
  return await getMatchRepo().findOne({ where: { id: matchId }})
}

export const matchHasNotExpire = (match: Match) => {
  const now = new Date()
  const matchDateTime = new Date(`${match.date}T${match.time}`);

  now.setUTCHours(matchDateTime.getUTCHours())
  now.setUTCMinutes(matchDateTime.getUTCMinutes())
  now.setUTCSeconds(matchDateTime.getUTCSeconds())
  now.setMilliseconds(0)

  if((matchDateTime.getUTCDate() >= now.getUTCDate()) && (matchDateTime.getTime() > now.getTime())) {
    return true;
  }

  return false;
}