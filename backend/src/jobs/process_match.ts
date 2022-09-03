import { queueJob, createRegisterer } from './general'
import { addToQueue as calculatePlayersMatchPoints } from './calculate_players_match_points'
import { getMatchById } from '../service/match_service';
import { MatchStatus } from '../entity/Match';

const handlerName = 'process_match';

const processQueuedJob = async (job: { matchId: number }) => {
  const match = await getMatchById(job.matchId)

  if (match) {
    if (match.status === MatchStatus.SCORE_ENTERED) {
      calculatePlayersMatchPoints(job.matchId)
    }
  }


  return true;
}


export const addToQueue = (matchId: number) => {
  queueJob({ handler: handlerName, data: { matchId } });
}


export default createRegisterer(handlerName, processQueuedJob)