import { MatchStatus } from '../entity/Match';
import { getMatchById, updateMatch } from '../service/match_service';
import { calculateScore, getScoreboardStream, getTipById, getTipsStreamByMatchId, updateTip } from '../service/tip_service';
import { queueJob, createRegisterer } from './general'
import { addToQueue as queuePushMessage } from './notify_users'

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

    stream.on('close', async () => {
      // mark match as completed
      updateMatch(match.id, { status: MatchStatus.COMPLETED })

      // notify all the users that have tip regarding their 
      // current position on the board
      const scoreboardStream = await getScoreboardStream()
      scoreboardStream.on('data', async (data) => {
        const d = JSON.parse(JSON.stringify(data));
        let surface = '';
        const lastDigit = parseInt(d.totalPoints[d.totalPoints.length - 1], 10);
        if (lastDigit === 1) {
          surface = 'st'
        } else if (lastDigit === 2) {
          surface = 'nd';
        } else if (lastDigit === 3) {
          surface = 'rd';
        } else {
          surface = 'th';
        }
        const body = `Your current position: ${d.totalPoints}${surface}`;
        const icon = ''; //@todo put a sick icon here 😂
        queuePushMessage({
          message: {
            title: 'The scores are in!',
            body,
            icon
          },
          user: d.user_id
        })
      })
    })

  }

  return job.matchId > 0
}

export const addToQueue = (matchId: number) => {
  queueJob({ handler: handlerName, data: { matchId } });
}

export default createRegisterer(handlerName, processQueuedJob)