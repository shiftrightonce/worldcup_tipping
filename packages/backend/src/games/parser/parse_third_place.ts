import { Match, YearData } from "./types";

export const getParsedThirdPlaceMatches = (round4WinnersAndLoosers: { [key: number]: { winner: string, looser: string } }, yearData: YearData) => {
  const matches: Array<Match & { countries: string[] }> = [];

  yearData.thirdPlace.forEach((entry) => {
    const tmp = { ...entry, countries: [] };
    const verses = entry.match.toLowerCase().split('v.').map((c) => c.trim().toUpperCase());

    verses.forEach((verse) => {
      const matchNumber = verse.split(':')[1]
      if (round4WinnersAndLoosers[matchNumber]) {
        tmp.countries.push(round4WinnersAndLoosers[matchNumber].looser)
      }
    });

    matches.push(tmp)
  });

  return matches;
}