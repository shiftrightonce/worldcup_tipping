import { queueJob, createRegisterer } from './general'
import { getRedisConnection } from '../redis_client'
import { CHAT_MESSAGE_REDIS_QUEUE, CHAT_ACTION_ROOM_MESSAGE } from '../socketio'
import { ChatMessage } from '../entity/ChatMessage';


const handlerName = 'process_chat_data';

export type JobPayload = {
  roomId: string,
  action: string
  data: Record<string, unknown> | ChatMessage
}

const processQueuedJob = async (job: JobPayload) => {

  try {
    const conn = await getRedisConnection(true)
    if (conn) {
      //@todo validate and stuff here
      await conn.rPush(CHAT_MESSAGE_REDIS_QUEUE, JSON.stringify(job));
    }
  } catch (e) {
    throw e;
  }

  return true;
}

export const addToQueue = (job: JobPayload) => {
  queueJob({ handler: handlerName, data: job })
}

export const queueRoomMessage = (roomId: string, message: ChatMessage ) => {
  addToQueue({
    roomId,
    action: CHAT_ACTION_ROOM_MESSAGE,
    data: message
  })
}

export default createRegisterer(handlerName, processQueuedJob)
