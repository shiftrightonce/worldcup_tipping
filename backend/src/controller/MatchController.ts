import { Request, Response } from "express";
import { MatchStatus } from "../entity/Match";
import { Tip } from "../entity/Tip";
import { UserRole } from "../entity/User";
import { getAllMatches, getMatchesByStatus, getTodayOpenMatches, matchHasNotExpire, updateMatch } from "../service/match_service";
import { placeUserTip } from "../service/tip_service";
import { pluckUserFromRequest } from "../service/user_service";

export class MatchController {

  public async todayMatchesAction () {
    return {
      success: true,
      todayMatches: await getTodayOpenMatches()
    }
  }

  public async completedMatchesAction () {
    return {
      success: true,
      completedMatches: await getMatchesByStatus(MatchStatus.COMPLETED)
    }
  }

  public async allMatchesAction (req: Request, res: Response) {
    return this.whenUserIsAdmin(req, res, async () => {
      const status = req.params.status
      return {
        success: true,
        status,
        matches: await getAllMatches(status ? status as MatchStatus : null)
      }
    })
  }

  public async updateMatchAction (req: Request, res: Response) {

    return this.whenUserIsAdmin(req, res, async () => {
      const matchId = req.params.matchId
      return await updateMatch(parseInt(matchId, 10), req.body)
    });
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

  private async whenUserIsAdmin (req: Request, res: Response, callback: Function) {
    const user = pluckUserFromRequest(req)
    if (user.role !== UserRole.ADMIN) {
      return {
        success: false,
        code: 'permission_denied',
        message: 'You do not have the right permission'
      }
    } else {
      return await callback()
    }
  }
}