import { MatchStatus } from '../entity/Match';
import { Tip } from '../entity/Tip';
import { getMatchById, updateMatch } from '../service/match_service';
import { calculateScore, getTipById, getTipsByMatchId, getTipsStreamByMatchId, updateTip } from '../service/tip_service';
import { ProcessorList, queueJob, createRegisterer } from './general'

const handlerName = 'calculate_player_match_points';

const processQueuedJob = async (job: { matchId: number }) => {
  const match = await getMatchById(job.matchId)

  if (match && match.status === MatchStatus.SCORE_ENTERED) {
    const stream = await getTipsStreamByMatchId(match.id)
    stream.on('data', async (data) => {
      const d = JSON.parse(JSON.stringify(data))
      const tip = await getTipById(d['tip_id'])
      tip.points = calculateScore(tip);
      await updateTip(tip)
    })

    stream.on('close', () => {
      // mark match as completed
      updateMatch(match.id, { status: MatchStatus.COMPLETED })
    })

  }
  console.log('calculating players match points', {
    matchNumber: match.number,
    matchId: match.id
  });

  return job.matchId > 0
}

export const addToQueue = (matchId: number ) => {
  queueJob({ handler: handlerName, data: { matchId } });
}

export default createRegisterer(handlerName, processQueuedJob)