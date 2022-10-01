import { AppDataSource } from "../data-source"
import { Country } from "../entity/Country";
import { Match, MatchRound, MatchStatus } from "../entity/Match";
import { User, UserRole } from "../entity/User";
import {
  getParsedGroupMatches,
  getParsedCountries,
  getData,
  year,
  YearData,
  Match as ParsedMatchType,
  getParsedRound16Matches,
  getParsedRound8Matches,
  getParsedRound4Matches,
  getParsedThirdPlaceMatches,
  getParsedFinalMatches
} from '../games/parser'
import { createChatRoom, findChatRoomByName } from "../service/chat_room_service";


const countries = {};

const setupAdminUser = async () => {
  const userRepo = AppDataSource.getRepository(User);
  let existing = await userRepo.findOneBy({ username: 'admin' });
  if (!existing) {
    const user = new User();
    user.email = 'admin@example.com';
    user.role = UserRole.ADMIN;
    user.username = 'admin';
    user.password = 'changeme';

    await userRepo.save(user);
  }
}

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
      country.groupPoints = -1;

      await countryRepo.save(country);
    }
  }

  (await countryRepo.findBy({
    year
  })).forEach((c) => {
    countries[c.internalId] = c;
  });
}

export const insertMatches = async (matches: Array<ParsedMatchType & { countries: string[] }>, round: MatchRound) => {
  const matchRepo = AppDataSource.getRepository(Match)
  for (const entry of matches) {
    const match = new Match();
    if (entry.countries.length === 2) {
      match.countryA = countries[entry.countries[0]];
      match.countryB = countries[entry.countries[1]];
    }

    match.match = entry.match;
    match.status = MatchStatus.PENDING;
    // match.penalty = entry.penalty; // we don't need to set this here
    match.year = year;
    match.number = entry.number;
    match.round = round;
    match.setDateAndTime(entry.date, entry.time);

    if (round !== MatchRound.GROUP) {
      const configDate = new Date(match.date.toUTCString());
      configDate.setDate(configDate.getDate() - 2);  // configuration is two days before the match
      match.toConfigureOn = configDate;
    } else {
      match.status = MatchStatus.OPEN;
    }

    await matchRepo.save(match)
  }
}
const setupGroupMatches = async (yearData: YearData) => {
  const matchRepo = AppDataSource.getRepository(Match)

  const totalGroupMatches = await matchRepo.countBy({
    round: MatchRound.GROUP
  });

  if (totalGroupMatches === 0) {
    const matches = getParsedGroupMatches(yearData);
    await insertMatches(matches, MatchRound.GROUP);
  }

}

const setupRound16Matches = async (yearData: YearData) => {
  const matchRepo = AppDataSource.getRepository(Match)
  const totalRound16Matches = await matchRepo.countBy({
    round: MatchRound.ROUND_16
  });

  if (totalRound16Matches === 0) {
    const fakeGroupWin = { fake: { winner: '', runnerUp: '' } }; // we don't have any group match winners at this point
    return await insertMatches(getParsedRound16Matches(fakeGroupWin, yearData), MatchRound.ROUND_16);
  }
}

const setupRound8Matches = async (yearData: YearData) => {
  const matchRepo = AppDataSource.getRepository(Match)
  const total = await matchRepo.countBy({
    round: MatchRound.ROUND_8
  });

  if (total === 0) {
    const fakeRound16Winners = {}
    return await insertMatches(getParsedRound8Matches(fakeRound16Winners, yearData), MatchRound.ROUND_8)
  }
}

const setupRound4Matches = async (yearData: YearData) => {
  const matchRepo = AppDataSource.getRepository(Match)
  const total = await matchRepo.countBy({
    round: MatchRound.ROUND_4
  });
  if (total === 0) {
    const fakeRound8Winners = {}
    return await insertMatches(getParsedRound4Matches(fakeRound8Winners, yearData), MatchRound.ROUND_4);
  }
}

const setup3rdPlaceMatch = async (yearData: YearData) => {
  const matchRepo = AppDataSource.getRepository(Match)
  const total = await matchRepo.countBy({
    round: MatchRound.THIRD_PLACE
  });
  if (total === 0) {
    const fakeRound4WinnersAndLoosers = { 1000: { winner: '', looser: '' } };
    return await insertMatches(getParsedThirdPlaceMatches(fakeRound4WinnersAndLoosers, yearData), MatchRound.THIRD_PLACE);
  }
}

const setupFinalMatch = async (yearData: YearData) => {
  const matchRepo = AppDataSource.getRepository(Match)
  const total = await matchRepo.countBy({
    round: MatchRound.FINAL
  });

  if (total === 0) {
    const fakeRound4WinnersAndLoosers = { 1000: { winner: '', looser: '' } };
    return await insertMatches(getParsedFinalMatches(fakeRound4WinnersAndLoosers, yearData), MatchRound.FINAL);
  }
}


const setupGeneralRoom = async () => {
  const name = 'General';
  const existing = await findChatRoomByName(name);

  if (!existing) {
    await createChatRoom(name)
  }
}

AppDataSource.initialize().then(async (dataSource) => {
  const yearData = await getData();

  // 0. setup user
  await setupAdminUser();

  // 1. setup countries
  await setupCountries(yearData);

  // 2. setup group matches
  await setupGroupMatches(yearData);

  // 3. setup round 16 matches. A cron/schedule job will update the countries after group matches
  await setupRound16Matches(yearData);

  // 4. sertup round 8 matches. A cron/schedule job will update the countries after round 16 matches
  await setupRound8Matches(yearData);

  // 5. setup round 4 matches. A cron/schedule job will update the countries after round 8 matches
  await setupRound4Matches(yearData);

  // 6. setup third place matches. A cron/scedule job will update the countries after round 4
  await setup3rdPlaceMatch(yearData);

  // 7. setup final match. A cron/schedule job will update the countries after round 4
  await setupFinalMatch(yearData);

  // 8. setup "general" chat room
  await setupGeneralRoom()

  // completed
  dataSource.destroy();
}).catch((e) => {
  console.error("error: ", (e as Error).message);
})