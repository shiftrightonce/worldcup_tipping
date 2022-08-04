import { NextFunction, Request, Response, CookieOptions } from "express"
import { checkPassword, generateAuthCookie, getUserRepo } from "../service/user_service";

export class PublicController {

  public async loginAction (req: Request, res: Response) {
    const username = req.body.username || '';
    const password = req.body.password || '';
    const errorMessage = 'posted data is incorrect'

    const user = await getUserRepo().findOneBy({
      username
    });

    if (user && checkPassword(user, password)) {
      const cookieOptions: CookieOptions = {
        sameSite: 'none',
        secure: true,
        signed: true
      }
      const cookie = generateAuthCookie(user);
      res.cookie('_t', cookie, cookieOptions).json({
        success: true,
        user
      });
      return null;
    }

    res.status(401).json({
      success: false,
      code: 'posted_data_incorrect',
      message: errorMessage
    });
  }

  public logoutAction (_: Request, res: Response) {
    const cookieOptions: CookieOptions = {
      sameSite: 'none',
      secure: true,
      signed: true
    }
    res.clearCookie('_t', cookieOptions)
      .json({
        success: 'true'
      })
  }
}