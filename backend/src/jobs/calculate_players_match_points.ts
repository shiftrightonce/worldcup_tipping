import { MatchStatus } from '../entity/Match';
import { getMatchById } from '../service/match_service';
import { getTipsByMatchId, getTipsStreamByMatchId } from '../service/tip_service';
import { ProcessorList, queueJob, createRegisterer } from './general'

const handlerName = 'calculate_player_match_points';

const processQueuedJob = async (job: { matchId: number }) => {
  const match = await getMatchById(job.matchId)

  if (match && match.status === MatchStatus.SCORE_ENTERED) {
    const tips = await getTipsByMatchId(match.id)
    tips.forEach((aTip) => {
      console.log("calculating....", aTip.id)
    })

    const stream = await getTipsStreamByMatchId(match.id)
    stream.on('data', (data) => {
      console.log(data)
    })
    stream.on('close', () => {
      // @todo Set the match to completed
      console.log('processing completed')
    })

  }
  console.log('calculating players match points', job)
  return job.matchId > 0
}

export const addToQueue = (matchId: number ) => {
  queueJob({ handler: handlerName, data: { matchId } });
}

export default createRegisterer(handlerName, processQueuedJob)