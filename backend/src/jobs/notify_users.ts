import { queueJob, createRegisterer } from './general'
import { setupPushNotification, sendNotification } from "../push_notification";

setupPushNotification()

const handlerName = 'notify_users';

export type JobPayload = {
  message: {
    title: string,
    body: string,
    icon?: string
  },
  user?: number
}

const processQueuedJob = async (job: JobPayload) => {
  await sendNotification(job.message, job.user)
  return true
}


export const addToQueue = (job: JobPayload) => {
  queueJob({ handler: handlerName, data: job })
}

export default createRegisterer(handlerName, processQueuedJob)