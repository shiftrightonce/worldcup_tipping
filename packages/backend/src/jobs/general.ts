import { getRedisConnection } from '../redis_client'

export const QUEUE_NAME = 'queue:match';

export type Processor = (data: Record<string, unknown>) => Promise<boolean>

export type ProcessorList = {
  [key: string]: Processor
}

export type Job = { handler: string, data: Record<string, unknown> }


export const queueJob = async (job: Job) => {
  try {
    const conn = await getRedisConnection(true)
    if (conn) {
      await conn.rPush(QUEUE_NAME, JSON.stringify(job));
      await conn.disconnect();
    }
  } catch (e) {
    throw e;
  }
}

export const createRegisterer = (handlerName: string, processor: Processor) => {
  return (list: ProcessorList) => list[handlerName] = processor
}