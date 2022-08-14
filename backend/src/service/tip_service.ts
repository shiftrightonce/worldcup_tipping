import { AppDataSource } from "../data-source"
import { Tip } from "../entity/Tip"
import { User } from "../entity/User"
import { year } from "../games/parser"
import { MatchStatus } from "../entity/Match";
import { getMatchById, matchHasNotExpire } from "./match_service"
import { getUserById } from "./user_service"

export const getTipRepo = () => {
  return AppDataSource.getRepository(Tip);
}

export const getUserMatchTip = async (matchId: number, userId: number) => {

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
      tip = await getTipRepo().save(tip);
    }
  }

  return tip;
}

export const getGetTipById = async (tipId: number) => {
  return await getTipRepo().findOne({
    where: {
      id: tipId
    }
  })
}

export const placeUserTip = async (tip: Tip, userId: number) => {
  const oldTip = await getGetTipById(tip.id)
  if (!oldTip) {
    return {
      success: false,
      code: 'match_is_not_open',
      message: 'Match is not open for tipping'
    };
  }
  if (oldTip.match.status !== MatchStatus.OPEN) {
    return {
      success: false,
      code: 'match_is_not_open',
      message: 'Match is not open for tipping'
    };
  }

  if (matchHasNotExpire(oldTip.match)) {
    delete tip.user
    if (tip.toWin && tip.toWin.id === 0) {
      tip.toWin = null
    }

    tip.countryAToScore = tip.countryAToScore || 0;
    tip.countryBToScore = tip.countryBToScore || 0;
    tip.countryAPenaltyToScore = tip.countryAPenaltyToScore || 0;
    tip.countryBPenaltyToScore = tip.countryBPenaltyToScore || 0;

    return {
      success: true,
      tip: await getTipRepo().update({
        id: oldTip.id,
        user: {
          id: userId
        }
      }, tip)
    }
  }

  return {
    success: false,
    code: 'tipping_time_expired',
    message: 'The match may have started'
  }
}

export const getScoreboard = async () => {
  const result = await getTipRepo().createQueryBuilder('tip')
    .where('tip.year = :year', { year })
    .leftJoinAndSelect("tip.user", "user")
    .addSelect('SUM(tip.points)', 'totalPoints')
    .groupBy('tip.userId')
    .orderBy('totalPoints', 'DESC')
    .limit(200)
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

export const getUserTotalScore = async (userId: number) => {
  const result = await getTipRepo().createQueryBuilder('tip')
    .where('tip.year = :year', { year })
    .where('tip.userId = :userId', {userId})
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