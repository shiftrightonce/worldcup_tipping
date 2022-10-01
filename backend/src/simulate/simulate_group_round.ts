import { AppDataSource } from "../data-source";
import { MatchRound } from "../entity/Match";
import { getMatchesByRound } from "../service/match_service";
import { run, getAllUsers, runTippingSimulation, runMatchPlaySimulation } from './simulate_general'

console.log(`
 |-----------------------------------------|\n
 |       simulating group round            |\n
 |-----------------------------------------|\n
`);


AppDataSource.initialize().then(async () => {
  const users = await getAllUsers()
  const matches = await getMatchesByRound(MatchRound.GROUP);

  if (run.tip) {
    await runTippingSimulation(matches, users, MatchRound.GROUP);
  }

  if (run.match) {
    await runMatchPlaySimulation(matches, MatchRound.GROUP)
  }

  AppDataSource.destroy();
}).catch((e) => {
  console.log('error simulating', e);
})
