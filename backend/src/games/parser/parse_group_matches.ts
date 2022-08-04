import { getParsedCountries } from "./parse_countries";
import { YearData, Match, ParsedMatch } from "./types";

export const getParsedGroupMatches = (yearData: YearData) => {
  const countries = getParsedCountries(yearData);
  const matches: ParsedMatch[] = [];

  yearData.groupMatches.forEach((entry) => {
    const countryIds = entry.match.toLowerCase().split('v.').map((c) => c.trim().toUpperCase());
    const tmp = { ...entry, countries: [] };
    countryIds.forEach((id) => {
      tmp.countries.push(countries[id].id)
    })
    matches.push(tmp);
  })

  return matches;
}