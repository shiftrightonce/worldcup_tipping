import { Request, Response } from "express";
import { MatchStatus } from "../entity/Match";
import { Tip } from "../entity/Tip";
import { UserRole } from "../entity/User";
import { getAllMatches, getMatchesByStatus, getTodayOpenMatches, matchHasNotExpire, updateMatch } from "../service/match_service";
import { placeUserTip } from "../service/tip_service";
import { pluckUserFromRequest } from "../service/user_service";

export class MatchController {

  public async todayMatchesAction (req: Request) {
    const user = pluckUserFromRequest(req);
    return {
      success: true,
      todayMatches: await getTodayOpenMatches(user)
    }
  }

  public async completedMatchesAction (req: Request) {
    const user = pluckUserFromRequest(req);
    return {
      success: true,
      completedMatches: await getMatchesByStatus(MatchStatus.COMPLETED, user)
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
    const data = req.body;

    if (data.match && !data.match.id) {
      data.match = {
        id: data.match
      }
    }
    const result = await placeUserTip(data as Tip, user.id)

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