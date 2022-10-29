import { AppDataSource } from "./data-source"
import { JobPayload, addToQueue as queuePushMessage } from './jobs/notify_users'


AppDataSource.initialize().then(async () => {
  // setupPushNotification()
  const job: JobPayload = {
    message: {title: 'Hello from server',  body: 'Body testing'}
  }
  queuePushMessage(job)

  //  const result = await sendNotification({title: 'Hello from server', options: { body: 'Body testing' }}, 1)
  

  AppDataSource.destroy()
});
