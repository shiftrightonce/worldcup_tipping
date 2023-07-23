import { queueJob, createRegisterer } from './general'
import { addToQueue as calculatePlayersMatchPoints } from './calculate_players_match_points'
import { addToQueue as updateRound16MatchCountries } from './update_round_16_match_countries'
import { addToQueue as updateRound8MatchCountries } from './update_round_8_match_countries'
import { addToQueue as updateRound4MatchCountries } from './update_round_4_match_countries'
import { addToQueue as updateThirdAndFinalMatchCountries } from './update_third_and_final_place_matches_countries'
import { getMatchById } from '../service/match_service';
import { MatchRound, MatchStatus } from '../entity/Match';

const handlerName = 'process_match';

const processQueuedJob = async (job: { matchId: number }) => {
  const match = await getMatchById(job.matchId)

  if (match) {
    if (match.status === MatchStatus.SCORE_ENTERED) {
      calculatePlayersMatchPoints(job.matchId);
    }

    if (match.round === MatchRound.GROUP) {
      updateRound16MatchCountries();
    }

    if (match.round === MatchRound.ROUND_16) {
      updateRound8MatchCountries();
    }

    if (match.round === MatchRound.ROUND_8) {
      updateRound4MatchCountries();
    }

    if (match.round === MatchRound.ROUND_4) {
      updateThirdAndFinalMatchCountries();
    }
  }


  return true;
}


export const addToQueue = (matchId: number) => {
  queueJob({ handler: handlerName, data: { matchId } });
}


export default createRegisterer(handlerName, processQueuedJob)