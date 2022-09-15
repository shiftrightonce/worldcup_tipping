import { MatchRound, MatchStatus } from '../entity/Match';
import { getData, getParsedRound16Matches, YearData } from '../games/parser';
import { getCountriesByIdsSortedByPoints } from '../service/country_service';
import { getGroupedMatches, getRoundMatchWithEmptyCountries, updateMatch } from '../service/match_service';
import { queueJob, createRegisterer } from './general'

const handlerName = 'update_round_16_match_countries';

const round16 = async (yearData: YearData) => {
  const matches = await getRoundMatchWithEmptyCountries(MatchRound.ROUND_16)

  if (matches.length <= 0) {
    return
  }

  const groupWinderAndRunnerUps = {};
  const countryRecords = {}
  const groupedMatches = await getGroupedMatches()
  for (const group in groupedMatches) {
    const countryIds: Record<number, number> = {};
    const allReady = groupedMatches[group].every((match) => {
      countryIds[match.countryA.id] = match.countryA.id;
      countryIds[match.countryB.id] = match.countryB.id;
      return match.status === MatchStatus.SCORE_ENTERED || match.status === MatchStatus.COMPLETED
    });

    if (allReady) {
      const countries = await getCountriesByIdsSortedByPoints(Object.values(countryIds));
      if (countries.length >= 2) {
        countryRecords[countries[0].internalId] = countries[0];
        countryRecords[countries[1].internalId] = countries[1];

        groupWinderAndRunnerUps[group] = {
          winner: countries[0].internalId,
          runnerUp: countries[1].internalId
        };
      }
    }
  }

  const round16Matches = {};
  getParsedRound16Matches(groupWinderAndRunnerUps, yearData).forEach((match) => {
    round16Matches[match.number] = match;
  })

  matches.forEach(async (match) => {
    if (round16Matches[match.number]) {
      match.countryA = countryRecords[round16Matches[match.number].countries[0]]
      match.countryB = countryRecords[round16Matches[match.number].countries[1]]

      await updateMatch(match.id, {
        status: MatchStatus.OPEN,
        countryA: match.countryA,
        countryB: match.countryB
      })
    }
  })

}

const processQueuedJob = async () => {
  const yearData = await getData()
  await round16(yearData);
  return true
}

export const addToQueue = () => {
  queueJob({ handler: handlerName, data: {} });
}

export default createRegisterer(handlerName, processQueuedJob)