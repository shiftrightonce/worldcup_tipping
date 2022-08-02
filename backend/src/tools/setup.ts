import { UsingJoinColumnIsNotAllowedError } from "typeorm";
import { AppDataSource } from "../data-source"
import { Country } from "../entity/Country";
import { Match, MatchRound, MatchStatus } from "../entity/Match";
import { getParsedGroupMatches, getParsedCountries, getData, year, YearData } from '../games/parser'


const countries = {};

const setupCountries = async (yearData: YearData) => {
  const countryRepo = AppDataSource.getRepository(Country);
  const totalCountries = await countryRepo.count();

  if (totalCountries === 0) {
    const countries = Object.values(getParsedCountries(yearData));
    for (const entry of countries) {

      const country = new Country();
      country.internalId = entry.id;
      country.name = entry.name;
      country.short = entry.short;
      country.year = year;
      country.image = entry.image;

      await countryRepo.save(country);
    }
  }

  (await countryRepo.findBy({
    year
  })).forEach((c) => {
    countries[c.internalId] = c;
  });
}

const setupGroupMatches = async (yearData: YearData) => {
  const matchRepo = AppDataSource.getRepository(Match)

  const totalGroupMatches = await matchRepo.countBy({
    round: MatchRound.GROUP
  });

  if (totalGroupMatches === 0) {
    const matches = getParsedGroupMatches(yearData);
    for (const entry of matches) {
      const match = new Match();
      match.countryA = countries[entry.countries[0]];
      match.countryB = countries[entry.countries[1]];
      match.match = entry.match;
      match.status = MatchStatus.PENDING;
      match.penalty = entry.penalty;
      match.year = year;
      match.number = entry.number;
      match.setDateAndTime(entry.date, entry.time);

      await matchRepo.save(match)
    }
  }

}

AppDataSource.initialize().then(async (dataSource) => {
  const yearData = await getData();

  // 1. setup countries
  await setupCountries(yearData);

  // 2. setup group matches
  await setupGroupMatches(yearData);

  // console.log(getParsedGroupMatches(yearData))

  // completed
  dataSource.destroy();
}).catch((e) => {
  console.error("error: ", (e as Error).message);
})