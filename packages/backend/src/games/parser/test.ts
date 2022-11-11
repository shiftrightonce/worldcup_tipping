import { generateRandomGroupPoints } from '../../bot/group_round_bot';
import { getParsedRound8Matches } from './parsed_round_8';
import { getData } from './parse_config'
import { getParsedCountries } from './parse_countries';
import { getParsedFinalMatches } from './parse_final';
import { getParsedGroupMatches } from './parse_group_matches';
import { getParsedRound16Matches } from './parse_round_16';
import { getParsedRound4Matches } from './parse_round_4';
import { getParsedThirdPlaceMatches } from './parse_third_place';
import { Country, Match, YearData, ParsedMatch } from './types';

const generateRandomGroupWins = (yearData: YearData) => {
  const winnerAndRunnerUp = {};
  const temp = JSON.parse(JSON.stringify(yearData.groups));

  for (const group in temp) {
    const groups = [];
    while (groups.length < 4) {
      const index = Math.floor(Math.random() * temp[group].length)
      groups.push(temp[group][index])
      temp[group].splice(index, 1)
    }

    const winner = Math.floor(Math.random() * 4);
    winnerAndRunnerUp[group] = {
      winner: groups[winner].id,
      runnerUp: ''
    };

    let runnerUp = winner;
    while (runnerUp === winner) {
      runnerUp = Math.floor(Math.random() * 4)
    }
    winnerAndRunnerUp[group].runnerUp = groups[runnerUp].id;
  }
  return winnerAndRunnerUp
}

const generateRandomRound16Wins = (round16ParsedMatches: ParsedMatch[]) => {
  const wins: { [key: string]: string } = {}
  round16ParsedMatches.forEach((match) => {
    const countries = [...match.countries];
    const matchNumber = match.number;
    wins[matchNumber] = countries.splice(Math.floor(Math.random() * 2)).pop()
  })

  return wins;
}

const generateRandomRound8Wins = (round8ParsedMatches: ParsedMatch[]) => {
  const wins: { [key: string]: string } = {}
  round8ParsedMatches.forEach((match) => {
    const countries = [...match.countries];
    const matchNumber = match.number;
    wins[matchNumber] = countries.splice(Math.floor(Math.random() * 2), 1).pop()
  })

  return wins;
}

const generateRandomRound4WinsAndLosts = (round4ParsedMatches: Array<Match & { countries: string[] }>) => {
  const wins: { [key: string]: { winner: string, looser: string } } = {}

  round4ParsedMatches.forEach((match) => {
    const countries = [...match.countries];
    const matchNumber = match.number;
    wins[matchNumber] = {
      winner: countries.splice(Math.floor(Math.random() * 2), 1).pop(),
      looser: countries.pop()
    };
  })

  return wins;
}

const generateRandomThirdPlacewins = (thirdPlaceParsedMatchs: Array<Match & { countries: string[] }>) => {
  const wins: { [key: string]: string } = {}
  thirdPlaceParsedMatchs.forEach((match) => {
    const countries = [...match.countries];
    const matchNumber = match.number;
    wins[matchNumber] = countries.splice(Math.floor(Math.random() * 2), 1).pop()
  })

  return wins;
}

const generateRandomFinalWins = (finalParsedMatches: Array<Match & { countries: string[] }>) => {
  const wins: { [key: string]: string } = {}
  finalParsedMatches.forEach((match) => {
    const countries = [...match.countries];
    const matchNumber = match.number;
    wins[matchNumber] = countries.splice(Math.floor(Math.random() * 2), 1).pop()
  })

  return wins;
}

(async () => {
  const yearData = await getData();
  const groupMatches = getParsedGroupMatches(yearData)

  const round16Matches = getParsedRound16Matches(generateRandomGroupWins(yearData), yearData)
  const round16Winners = generateRandomRound16Wins(round16Matches);
  const round8Matches = getParsedRound8Matches(round16Winners, yearData);
  const round8Winners = generateRandomRound8Wins(round8Matches);
  const round4Matches = getParsedRound4Matches(round8Winners, yearData);
  const round4Winners = generateRandomRound4WinsAndLosts(round4Matches);
  const thirdPlaceMatches = getParsedThirdPlaceMatches(round4Winners, yearData);
  const thirdPlaceWinners = generateRandomThirdPlacewins(thirdPlaceMatches);
  const finalMatches = getParsedFinalMatches(round4Winners, yearData);
  const finalWinner = generateRandomFinalWins(finalMatches);

  console.log("game winner", finalWinner);

})()
