import { Request, Response } from "express"
import { whenUserIsAdmin } from "../service/user_service";
import { JobPayload, addToQueue as queuePushMessage } from '../jobs/notify_users'

export class AdminController {
   
  public async sendPushNotificationAction (req: Request, res: Response) {
    return whenUserIsAdmin(req, res, () => {
      queuePushMessage(req.body as JobPayload)
      return {
        success: true
      }
    })
  }
}
