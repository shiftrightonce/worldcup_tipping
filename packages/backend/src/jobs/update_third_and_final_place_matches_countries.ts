import { MatchRound, MatchStatus } from '../entity/Match';
import { getData, getParsedFinalMatches, getParsedThirdPlaceMatches } from '../games/parser';
import { getMatchesByRound, getRoundMatchWithEmptyCountries, updateMatch } from '../service/match_service';
import { createRegisterer, queueJob } from './general';


const handlerName = 'update_third_n_final_place_matches_countries';


const processQueuedJob = async (job: { round: MatchRound }) => {
  const matches = await getRoundMatchWithEmptyCountries(job.round);

  if (matches.length <= 0) {
    return;
  }

  const yearData = await getData();
  const round4MatchesWinnersAndLoosers = {};
  const winnersLoosers = {};

  (await getMatchesByRound(MatchRound.ROUND_4)).forEach((match) => {
    if (match.status === MatchStatus.COMPLETED) {
      round4MatchesWinnersAndLoosers[match.number] = {
        winner: match.winner.internalId,
        looser: match.getLooser()?.internalId
      };
      winnersLoosers[match.countryA.internalId] = match.countryA;
      winnersLoosers[match.countryB.internalId] = match.countryB;
    }
  })

  const roundMatches = {};
  if (job.round === MatchRound.THIRD_PLACE) {
    getParsedThirdPlaceMatches(round4MatchesWinnersAndLoosers, yearData).forEach((match) => {
      roundMatches[match.number] = match
    })
  } else if (job.round === MatchRound.FINAL) {
    getParsedFinalMatches(round4MatchesWinnersAndLoosers, yearData).forEach((match) => {
      roundMatches[match.number] = match
    })
  }

  matches.forEach(async (match) => {
    if (roundMatches[match.number]) {
      match.countryA = winnersLoosers[roundMatches[match.number].countries[0]];
      match.countryB = winnersLoosers[roundMatches[match.number].countries[1]];

      if (match.countryA && match.countryB) {
        await updateMatch(match.id, {
          status: MatchStatus.OPEN,
          countryA: match.countryA,
          countryB: match.countryB
        });
      }
    }
  });


  return true;
}

export const addToQueue = () => {
  queueJob({ handler: handlerName, data: { round: MatchRound.THIRD_PLACE } });
  queueJob({ handler: handlerName, data: { round: MatchRound.FINAL } });
}

export default createRegisterer(handlerName, processQueuedJob);
