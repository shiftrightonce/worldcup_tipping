import { MoreThanOrEqual } from 'typeorm'
import { AppDataSource } from "../data-source"
import { Match, MatchStatus } from "../entity/Match";
import { queueProcessMatch } from '../jobs'
import { year as configYear } from '../games/parser/parse_config'

export const getMatchRepo = () => {
  return AppDataSource.getRepository(Match)
}

export const getTodayMatches = async (year = configYear) => {
  const date = new Date();
  return await getMatchRepo().find({
    where: {
      date,
      year
    },
    order: {
      date: 'ASC',
      time: 'ASC'
    }
  })
}

export const getAllMatches = async (status: MatchStatus | null, year = configYear) => {
  if (status) {
    return await getMatchRepo().find({
      where: {
        status,
        year
      },
      order: {
        number: 'ASC'
      }
    })
  } else {
    return await getMatchRepo().find({
      order: {
        number: 'ASC'
      }
    })
  }
}

export const getTodayOpenMatches = async (year = configYear) => {
  const date = new Date();
  const time = `${date.getUTCHours()}:${date.getUTCMinutes()}:00`;
  return await getMatchRepo().find({
    where: {
      date: MoreThanOrEqual(date),
      status: MatchStatus.OPEN,
      year,
      // time: MoreThan(time),
    },
    order: {
      number: 'ASC'
    }
  })

}

export const getMatchesByStatus = async (status: MatchStatus, year = configYear) => {
  return await getMatchRepo().find({
    where: {
      status,
      year,
    },
    order: {
      number: 'DESC'
    }
  })
}

export const getMatchById = async (matchId: number) => {
  return await getMatchRepo().findOne({ where: { id: matchId } })
}

export const matchHasNotExpire = (match: Match) => {
  const now = new Date()
  const matchDateTime = new Date(`${match.date}T${match.time}Z`);

  // now.setUTCHours(matchDateTime.getUTCHours())
  // now.setUTCMinutes(matchDateTime.getUTCMinutes())
  // now.setUTCSeconds(matchDateTime.getUTCSeconds())
  // now.setMilliseconds(0)

  // console.log(`(${matchDateTime.getUTCDate()} >= ${now.getUTCDate()}), (${matchDateTime.getUTCMonth()} >= ${now.getUTCMonth()}), (${matchDateTime.getUTCFullYear()} === ${now.getUTCFullYear()}), (${matchDateTime.getTime()} > ${now.getTime()})`);

  if ((matchDateTime.getTime() > now.getTime())) {
    return true;
  }

  return false;
}

export const updateMatch = async (matchId: number, data: { [key: string]: unknown }) => {
  const match = await getMatchById(matchId);

  if (match) {
    for (const key in data) {
      let value = data[key];
      switch (key) {
        case 'winner':
          if ((value as { id: number }).id === 0) {
            data[key] = null
          }
          break;
        case 'countryAGoals':
        case 'countryBGoals':
        case 'countryAPenaltyGoals':
        case 'countryBPenaltyGoals':
          data[key] = value || 0;
          break;
      }
    }

    const savedMatch = await getMatchRepo().update({
      id: match.id
    }, data);

    queueProcessMatch(match.id);

    return {
      success: true,
      match: savedMatch 
    }
  }

  return {
    success: false,
    code: 'match_not_found',
    message: `match with ID ${matchId} not found`,
    match: null
  }
}