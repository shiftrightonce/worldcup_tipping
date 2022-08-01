import { GroupWinnerAndRunnerUp, Match, YearData } from "./types";

export const getParsedRound16Matches = (winnerAndRunnerUp: GroupWinnerAndRunnerUp, yearData: YearData): Array<Match & { countries: string[] }> => {
  const matches = [];
  if (Object.keys(winnerAndRunnerUp).length <= 0) {
    return [];
  }

  yearData.round16.forEach((entry) => {
    const verses = entry.match.toLowerCase().split('v.').map((c) => c.trim().toUpperCase());
    const tmp = { ...entry, countries: [] }
    verses.forEach((verse) => {
      const positionAndGroup = verse.split(':')
      const position = positionAndGroup[0];
      const group = positionAndGroup[1];

      if (!winnerAndRunnerUp[group]) {
        return;
      }

      switch (position) {
        case 'WINNER':
          tmp.countries.push(winnerAndRunnerUp[group].winner)
          break;
        case 'RUNNER-UP':
          tmp.countries.push(winnerAndRunnerUp[group].runnerUp)
          break;
      }
    })
      matches.push(tmp)
  })

  return matches;
}