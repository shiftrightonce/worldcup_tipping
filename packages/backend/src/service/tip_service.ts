import { AppDataSource } from "../data-source"
import { Tip } from "../entity/Tip"
import { year as configYear } from "../games/parser"
import { MatchStatus, MatchRound, Match } from "../entity/Match";
import { getMatchById, matchHasNotExpire } from "./match_service"
import { cleanUserData, getUserById, getUserByInternalId } from "./user_service"
import { User } from "../entity/User";

export const getTipRepo = () => {
  return AppDataSource.getRepository(Tip);
}

export const createTip = async (year = configYear) => {
  let tip = new Tip();
  tip.id = 0;
  tip.year = year;
  tip.countryAToScore = 0;
  tip.countryBToScore = 0;
  tip.countryAPenaltyToScore = 0;
  tip.countryBPenaltyToScore = 0;
  tip.isLevel = false;
  tip.toPenalty = false;
  tip.points = 0;
  tip.entryByBot = false;

  return tip
}

export const getUserMatchTip = async (matchId: number, userId: number, year = configYear) => {

  let tip = await getTipRepo().findOneBy({
    user: {
      id: userId
    },
    match: {
      id: matchId
    }
  })

  if (!tip) {
    const match = await getMatchById(matchId);
    const user = await getUserById(userId);
    if (match && user) {
      tip = new Tip();
      tip.match = match;
      tip.user = user;
      tip.year = year;
      tip.countryAToScore = 0;
      tip.countryBToScore = 0;
      tip.countryAPenaltyToScore = 0;
      tip.countryBPenaltyToScore = 0;
      tip.isLevel = false;
      tip.toPenalty = false;
      // tip = await getTipRepo().save(tip); // @todo don't save the tip yet !@!@#!
    }
  }

  return tip;
}

export const getUserClosedTips = async (userInternalId: string, year = configYear) => {
  const user = await getUserByInternalId(userInternalId);
  if (user) {
    const tips = await getTipRepo().find({
      where: {
        user: {
          id: user.id
        },
        year,
        match: {
          status: MatchStatus.COMPLETED
        }
      },
      order: {
        match: {
          number: 'ASC'
        }
      }
    });
    return tips.map((tip) => {
      if (typeof tip.user === 'object') {
        tip.user = cleanUserData(tip.user)
      }

      return tip;
    })
  }

  return []
}

export const getTipById = async (tipId: number) => {
  return await getTipRepo().findOne({
    where: {
      id: tipId
    }
  })
}

export const updateTip = async (tip: Tip) => {
  await getTipRepo().update(
    tip.id,
    tip
  )
  return getTipById(tip.id)
}


export const placeUserTip = async (tip: Tip, userId: number, year = configYear) => {
  const oldTip = await getTipRepo().findOne({
    where: {
      year: tip.year || year,
      match: {
        id: tip.match.id
      },
      user: {
        id: userId
      }
    }
  })

  const match = await getMatchById(tip.match.id);

  if (match.status !== MatchStatus.OPEN) {
    return {
      success: false,
      code: 'match_is_not_open',
      message: 'Match is not open for tipping'
    };
  }

  if (matchHasNotExpire(match)) {
    delete tip.user
    if (tip.toWin && tip.toWin.id === 0) {
      tip.toWin = null
    }

    tip.countryAToScore = tip.countryAToScore || 0;
    tip.countryBToScore = tip.countryBToScore || 0;
    tip.countryAPenaltyToScore = tip.countryAPenaltyToScore || 0;
    tip.countryBPenaltyToScore = tip.countryBPenaltyToScore || 0;

    if (oldTip) {
      await getTipRepo().update({
        id: oldTip.id,
        user: {
          id: userId
        }
      }, tip)
    } else {
      const user = await getUserById(userId);
      if (match && user) {
        tip.match = match;
        tip.user = user;
        tip.year = tip.year || year;
        tip = await getTipRepo().save(tip); // @todo don't save the tip yet !@!@#!
      }
    }

    return {
      success: true,
      tip: await getTipById(tip.id)
    }
  }

  return {
    success: false,
    code: 'tipping_time_expired',
    message: 'The match may have started',
    tip: null
  }
}

// Deprecated: Use `getScoreboard` from `scordboard_service`
export const getScoreboard = async (limit = 200, year = configYear) => {
  const result = await getTipRepo().createQueryBuilder('tip')
    .where('tip.year = :year', { year })
    .leftJoinAndSelect("tip.user", "user")
    .addSelect('SUM(tip.points)', 'totalPoints')
    .groupBy('tip.userId')
    .orderBy('totalPoints', 'DESC')
    .limit(limit)
    .getRawMany()

  return result.map((entry) => {
    return {
      totalPoints: entry.totalPoints,
      user: {
        id: entry.user_id,
        username: entry.user_username
      }
    }
  })
}

export const getScoreboardStream = async (year = configYear) => {
  return await getTipRepo().createQueryBuilder('tip')
    .where('tip.year = :year', { year })
    .leftJoinAndSelect("tip.user", "user")
    .addSelect('SUM(tip.points)', 'totalPoints')
    .groupBy('tip.userId')
    .orderBy('totalPoints', 'DESC')
    .stream();
}

export const getUserTotalScore = async (userId: number, year = configYear) => {
  const result = await getTipRepo().createQueryBuilder('tip')
    .where('tip.year = :year', { year })
    .where('tip.userId = :userId', { userId })
    .leftJoinAndSelect("tip.user", "user")
    .addSelect('SUM(tip.points)', 'totalPoints')
    .groupBy('tip.userId')
    .orderBy('totalPoints', 'DESC')
    .getRawMany()

  return result.map((entry) => {
    return {
      totalPoints: entry.totalPoints,
      user: {
        id: entry.user_id,
        username: entry.user_username
      }
    }
  }).pop()
}

export const getTipsByMatchId = async (matchId: number) => {
  return await getTipRepo().findBy({
    match: {
      id: matchId
    }
  })
}

export const getTipsStreamByMatchId = async (matchId: number, alias = 'tip') => {
  return await getTipRepo().createQueryBuilder(alias)
    .where('matchId = :matchId', { matchId })
    .stream()
}

export const calculateScore = (tip: Tip) => {
  const match = tip.match

  const toPenalty = () => {
    if (match.round === MatchRound.GROUP) {
      return 0
    }

    return (tip.toPenalty === match.penalty) ? 5 : 0;

  }
  const countryScore = () => {
    let points = 0;
    const weigth = 1;

    if (tip.countryAToScore === match.countryAGoals) {
      points += (tip.countryAToScore || 1) * weigth
    }

    if (tip.countryBToScore === match.countryBGoals) {
      points += (tip.countryBToScore || 1) * weigth
    }

    return points;
  }
  const countryPenalTyScore = () => {
    let points = 0;
    const weigth = 1;

    if (match.round === MatchRound.GROUP) {
      return 0
    }

    if (tip.countryAPenaltyToScore === match.countryAPenaltyGoals) {
      points += (tip.countryAPenaltyToScore || 1) * weigth
    }
    if (tip.countryBPenaltyToScore === match.countryBPenaltyGoals) {
      points += (tip.countryBPenaltyToScore || 1) * weigth
    }

    return points;
  }
  const isLevel = () => {
    return (tip.isLevel && match.winner === null) ? 1 : 0
  }
  const toWin = () => {
    return (match.winner && tip.toWin && match.winner.id === tip.toWin.id) ? 1 : 0;
  }

  const matchScore = () => {
    return (tip.countryAToScore === match.countryAGoals && tip.countryBToScore === match.countryBGoals) ? 2 : 0
  }

  const marks: Array<() => number> = [
    toPenalty,
    countryScore,
    countryPenalTyScore,
    isLevel,
    toWin,
    matchScore
  ];

  return marks.map((calculator) => calculator()).reduce((n, c) => n + c, 0)
}

export const countTips = async (year = configYear) => {
  return await getTipRepo().count({
    where: {
      year
    }
  });
}