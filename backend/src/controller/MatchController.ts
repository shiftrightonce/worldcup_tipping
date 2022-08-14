import { Request, Response } from "express";
import { MatchStatus } from "../entity/Match";
import { Tip } from "../entity/Tip";
import { getMatchesByStatus, getTodayOpenMatches, matchHasNotExpire } from "../service/match_service";
import { placeUserTip } from "../service/tip_service";
import { pluckUserFromRequest } from "../service/user_service";

export class MatchController {

  public async todayMatchesAction () {
    return await getTodayOpenMatches()
  }

  public async completedMatchesAction () {
    return await getMatchesByStatus(MatchStatus.COMPLETED)
  }

  public async placeTipAction (req: Request, res: Response) {
    const user = pluckUserFromRequest(req);
    const body = req.body as Tip
    const result = await placeUserTip(body, user.id)

    if (result.success) {
      return result
    } else {
      res.status(400).json(result)
    }
  }
}