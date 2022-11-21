import { AppDataSource } from "../../data-source";
import { getMatchByNumber } from "../../service/match_service";
import { getTipsStreamByMatchId, getTipById, calculateScore, updateTip } from "../../service/tip_service";


AppDataSource.initialize().then(async () => {
  const matchNumber = process.argv[2].toString().trim();

  if (matchNumber && !isNaN(parseInt(matchNumber, 10))) {
    const match = await getMatchByNumber(parseInt(matchNumber, 10))
    if (match) {
      const stream = await getTipsStreamByMatchId(match.id)
      stream.on('data', async (data) => {
        const d = JSON.parse(JSON.stringify(data))
        const tip = await getTipById(d['tip_id'])
        tip.points = calculateScore(tip);
        await updateTip(tip)
      });

      stream.on('close', async () => {
        console.log(`tips for match ${match.id} have been updated`);
      });
    }
  }

  AppDataSource.destroy();
});