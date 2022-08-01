import { Match, YearData } from "./types";

export const getParsedRound4Matches = (round8Winners: {[key: number]: string}, yearData: YearData) => {
  const matches: Array<Match & { countries: string[] }> = [];

  yearData.round4.forEach((entry) => { 
    const tmp = { ...entry, countries: [] };
    const verses = entry.match.toLowerCase().split('v.').map((c) => c.trim().toUpperCase());

    verses.forEach((verse) => {
      const matchNumber = verse.split(':')[1]
      if (round8Winners[matchNumber]) {
        tmp.countries.push(round8Winners[matchNumber])
      }
     });

    if (tmp.countries.length === 2) {
      matches.push(tmp)
    }
  });

  return matches;
}