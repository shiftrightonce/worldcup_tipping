import { AppDataSource } from "../data-source";
import { MatchRound } from "../entity/Match";
import { getCountryCount, updateCountry } from "../service/country_service";
import { getGroupedMatches, getMatchesByRound } from "../service/match_service";
import { run, getAllUsers, runTippingSimulation, runMatchPlaySimulation } from './simulate_general'
import * as cliProgress from 'cli-progress';
import { Country } from "../entity/Country";

console.log(`
 |-----------------------------------------|\n
 |       simulating group round            |\n
 |-----------------------------------------|\n
`);

const runGroupPointsSimulation = async () => {
  const groupedMatches = await getGroupedMatches();

  const bar1 = new cliProgress.SingleBar({
    clearOnComplete: false,
  }, cliProgress.Presets.shades_classic);

  console.log('Calculating countries\' points:\r');
  bar1.start(await getCountryCount(), 0);
  const countries: { [key: number]: Country } = {}
  for (const group in groupedMatches) {
    groupedMatches[group].forEach((match) => {
      if (!countries[match.countryA.id]) {
        countries[match.countryA.id] = match.countryA;
        countries[match.countryA.id].groupPoints = (match.countryA.groupPoints < 0) ? 0 : match.countryA.groupPoints;
      }
      if (!countries[match.countryB.id]) {
        countries[match.countryB.id] = match.countryB;
        countries[match.countryB.id].groupPoints = (match.countryB.groupPoints < 0) ? 0 : match.countryB.groupPoints;
      }


      if (match.winner) {
        if (match.winner.id === match.countryA.id) {
          countries[match.countryA.id].groupPoints += 3;
        } else {
          countries[match.countryB.id].groupPoints += 3;
        }
      } else {
        countries[match.countryA.id].groupPoints += 1;
        countries[match.countryB.id].groupPoints += 1;
      }
    })

  }

  for (const country of Object.values(countries)) {
    await updateCountry(country.id, { groupPoints: country.groupPoints });
    bar1.increment(1)
  }

  bar1.stop();
}


AppDataSource.initialize().then(async () => {
  const users = await getAllUsers()
  const matches = await getMatchesByRound(MatchRound.GROUP);

  if (run.tip) {
    await runTippingSimulation(matches, users, MatchRound.GROUP);
  }

  if (run.match) {
    await runMatchPlaySimulation(matches, MatchRound.GROUP);
    await runGroupPointsSimulation();
  }

  AppDataSource.destroy();
}).catch((e) => {
  console.log('error simulating', e);
})
