import { Request, Response } from "express"
import { countUsers, whenUserIsAdmin } from "../service/user_service";
import { JobPayload, addToQueue as queuePushMessage } from '../jobs/notify_users'
import { countTips } from "../service/tip_service";

export class AdminController {

  public async sendPushNotificationAction (req: Request, res: Response) {
    return whenUserIsAdmin(req, res, () => {
      queuePushMessage(req.body as JobPayload)
      return {
        success: true
      }
    })
  }

  public async userCountAction (req: Request, res: Response) {
    return whenUserIsAdmin(req, res, async () => {
      return {
        success: true,
        count: await countUsers()
      }
    });
  }

  public async tipCountAction (req: Request, res: Response) {
    return whenUserIsAdmin(req, res, async () => {
      return {
        success: true,
        count: await countTips()
      }
    });
  }
}
