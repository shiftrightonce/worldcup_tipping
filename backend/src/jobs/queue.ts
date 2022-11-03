import { getRedisConnection } from '../redis_client'
import { QUEUE_NAME, ProcessorList, Job } from './general'
import calculatePlayerMatchPoints from './calculate_players_match_points'
import processMatch from './process_match'
import notifyUsers from './notify_users'
import updateRound16MatchCountries from './update_round_16_match_countries'
import updateRound8MatchCountries from './update_round_8_match_countries'
import updateRound4MatchCountries from './update_round_4_match_countries'
import updateThirdAndFinalMatchCountries from  './update_third_and_final_place_matches_countries'
import processChatData from './process_chat_data'
import { AppDataSource } from '../data-source'


const processors: ProcessorList = {}

// register processors
calculatePlayerMatchPoints(processors);
processMatch(processors);
notifyUsers(processors);
updateRound16MatchCountries(processors);
updateRound8MatchCountries(processors);
updateRound4MatchCountries(processors);
updateThirdAndFinalMatchCountries(processors);
processChatData(processors);


AppDataSource.initialize().then(async () => {
  getRedisConnection(true)
    .then(async (client) => {
      client.executeIsolated(async (c) => {
        do {
          const job = await c.blPop(
            QUEUE_NAME,
            0
          );
          const theJob = job.element ? JSON.parse(job.element) as Job : { handler: 'unknown', data: {} }

          if (processors[theJob.handler]) {
            try {
              await processors[theJob.handler](theJob.data)
            } catch (e) {
              console.log('error processing job', e.message)
            }
          }
        } while (true)
      })
    })
    .catch((e) => {
      console.log('error connecting to redis: ' + e.message)
    })

}).catch(error => console.log(error))

console.log("Queue is up and running \r\n")