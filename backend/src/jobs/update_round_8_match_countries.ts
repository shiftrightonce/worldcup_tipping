import { AppDataSource } from '../data-source'
import { MatchRound, MatchStatus } from '../entity/Match';
import { getData, getParsedRound8Matches } from '../games/parser';
import { getMatchesByRound, getRoundMatchWithEmptyCountries, updateMatch } from '../service/match_service';
import { createRegisterer, queueJob } from './general';

const handlerName = 'update_round_8_match_countries';


const processQueuedJob = async () => {
  const matches = await getRoundMatchWithEmptyCountries(MatchRound.ROUND_8);

  if (matches.length <= 0) {
    return;
  }

  const yearData = await getData()
  const round16MatchesWinners = {};
  const winners = {};
  (await getMatchesByRound(MatchRound.ROUND_16)).forEach((match) => {
    // if (match.status === MatchStatus.COMPLETED) {
    // round16Matches[match.number] = match.winner.internalId;
    // winners[match.winner.internalId] = match.winner;
    // }

    //  @todo remove after testing
    round16MatchesWinners[match.number] = match.countryA.internalId;
    winners[match.countryA.internalId] = match.countryA;
  })

  const round8Matches = {};
  getParsedRound8Matches(round16MatchesWinners, yearData).forEach((match) => {
    round8Matches[match.number] = match
  })

  matches.forEach(async (match) => {
    if (round8Matches[match.number]) {
      match.countryA = winners[round8Matches[match.number].countries[0]];
      match.countryB = winners[round8Matches[match.number].countries[1]];

      await updateMatch(match.id, {
        status: MatchStatus.OPEN,
        countryA: match.countryA,
        countryB: match.countryB
      })
    }
  })
  return true
}


export const addToQueue = () => {
  queueJob({ handler: handlerName, data: {}})
}

export default createRegisterer(handlerName, processQueuedJob)
