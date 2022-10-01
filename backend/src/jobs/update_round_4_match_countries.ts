import { MatchRound, MatchStatus } from '../entity/Match';
import { getData, getParsedRound4Matches } from '../games/parser';
import { getMatchesByRound, getRoundMatchWithEmptyCountries, updateMatch } from '../service/match_service';
import { createRegisterer, queueJob } from './general';

const handlerName = 'update_round_4_match_countries';

const processQueuedJob = async () => {
  const matches = await getRoundMatchWithEmptyCountries(MatchRound.ROUND_4);

  if (matches.length <= 0) {
    return;
  }

  const yearData = await getData();
  const round8MatchesWinners = {};
  const winners = {};

  (await getMatchesByRound(MatchRound.ROUND_8)).forEach((match) => {
    if (match.status === MatchStatus.COMPLETED) {
      round8MatchesWinners[match.number] = match.winner.internalId;
      winners[match.winner.internalId] = match.winner;
    }
  })

  const round4Matches = {};
  getParsedRound4Matches(round8MatchesWinners, yearData).forEach((match) => {
    round4Matches[match.number] = match
  })

  matches.forEach(async (match) => {
    if (round4Matches[match.number]) {
      match.countryA = winners[round4Matches[match.number].countries[0]];
      match.countryB = winners[round4Matches[match.number].countries[1]];

      await updateMatch(match.id, {
        status: MatchStatus.OPEN,
        countryA: match.countryA,
        countryB: match.countryB
      })
    }
  });

  return true;
}

export const addToQueue = () => {
  queueJob({ handler: handlerName, data: {} })
}

export default createRegisterer(handlerName, processQueuedJob)
