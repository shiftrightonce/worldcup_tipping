import { Request, Response } from "express"
import { env } from "../data-source";
import { getUserScore } from "../service/scoreboard_service";
// import { getScoreboard, getUserTotalScore } from "../service/tip_service"
import { getScoreboard } from '../service/scoreboard_service'
import { pluckUserFromRequest } from "../service/user_service";
import { year as configYear } from "../games/parser"

export class TipController {

  public async scoreboardAction () {
    return {
      success: true,
      scoreboard: await getScoreboard(env('SCORE_BOARD_LIMIT_TO_SHOW', 200))
    }
  }

  public async myTotalScoreAction (req: Request, res: Response) {
    const user = pluckUserFromRequest(req); 
    req.params.user = user.id.toString()
    return await this.userTotalScoreAction(req, res);
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
    const year = (req.params.year) ? parseInt(req.params.year, 10) : configYear;
    const score = await getUserScore(parseInt(req.params.user, 10), year)
    if (score) {
      return {
        success: true,
        score
      }
    }

    res.status(404).json({
      success: false,
      code: 'score_not_found',
      message: 'Could not find a score for the user'
    })
    return;
  }
}