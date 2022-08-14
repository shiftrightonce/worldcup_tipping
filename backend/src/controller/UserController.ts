import { Request, Response } from "express"
import { getUserMatchTip } from "../service/tip_service"
import { pluckUserFromRequest } from "../service/user_service";

export class UserController {


  public async getMatchTipAction (req: Request, res: Response) {
    const user = pluckUserFromRequest(req)
    const matchId = req.params.match;

    const tip = await getUserMatchTip(parseInt(matchId, 10), user.id)

    if (!tip) {
      res.status(404).json({
        success: false,
        code: 'tip_not_found',
        message: 'Could not find tip. User or Match information maybe wrong'
      });
    } else {
      res.json({
        success: true,
        tip
      });
    }
  }
}