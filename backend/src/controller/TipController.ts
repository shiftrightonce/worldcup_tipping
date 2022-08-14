import { Request, Response } from "express"
import { getScoreboard, getUserTotalScore } from "../service/tip_service"

export class TipController {

  public async scoreboardAction () {
    return {
      success: true,
      scoreboard: await getScoreboard()
    }
  }

  public async userTotalScoreAction (req: Request, res: Response) {
    if (!req.params.user) {
      res.status(404).json({
        success: false,
        code: 'user_not_specified',
        message: 'User ID not specified'
      })
      return;
    }
    return {
      success: true,
      score: await getUserTotalScore(parseInt(req.params.user, 10))
    }
  }
}