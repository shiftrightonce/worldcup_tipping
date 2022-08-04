import { Match, YearData } from "./types";

export const getParsedRound8Matches = (round16Winners: { [key: number]: string }, yearData: YearData) => {
  const matches: Array<Match & { countries: string[] }> = [];

  yearData.round8.forEach((entry) => {
    const tmp = { ...entry, countries: [] };
    const verses = entry.match.toLowerCase().split('v.').map((c) => c.trim().toUpperCase());

    verses.forEach((verse) => {
      const matchNumber = verse.split(':')[1]
      if (round16Winners[matchNumber]) {
        tmp.countries.push(round16Winners[matchNumber])
      }
    });

    matches.push(tmp)
  });

  return matches;
}