import { queueJob, createRegisterer } from './general'

const handlerName = 'notify_users';

export type Payload = {
  title: string,
  message: string,
  code?: string
}

const processQueuedJob = async (job: Payload) => {
  // @todo implement!!!
  return true
}


export const addToQueue = (payload: Payload) => {
  queueJob({ handler: handlerName, data: payload})
}

export default createRegisterer(handlerName, processQueuedJob)