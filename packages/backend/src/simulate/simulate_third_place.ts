import { AppDataSource } from "../data-source";
import { MatchRound } from "../entity/Match";
import { getMatchesByRound } from "../service/match_service";
import { run, getAllUsers, runTippingSimulation, runMatchPlaySimulation } from './simulate_general'

console.log(`
 |-----------------------------------------|\n
 |       simulating third place            |\n
 |-----------------------------------------|\n
`);


AppDataSource.initialize().then(async () => {
  const users = await getAllUsers()
  const matches = await getMatchesByRound(MatchRound.THIRD_PLACE);

  if (run.tip) {
    await runTippingSimulation(matches, users, MatchRound.THIRD_PLACE);
  }

  if (run.match) {
    await runMatchPlaySimulation(matches, MatchRound.THIRD_PLACE)
  }

  AppDataSource.destroy();
}).catch((e) => {
  console.log('\nerror simulating', e.message);
  console.log(e)
})
