import { NextFunction, Request, Response, CookieOptions } from "express"
import path = require("path");
import { env } from "../data-source";
import { User } from "../entity/User";
import { checkPassword, createUser, generateAuthCookie, getUserRepo } from "../service/user_service";

export class PublicController {

  public async indexAction (req: Request, res: Response) {
    return 'Index Page. Coming soon';
  }

  public async loginAction (req: Request, res: Response) {
    const username = req.body.username || '';
    const password = req.body.password || '';
    const errorMessage = 'posted data is incorrect'

    const user = await getUserRepo().findOneBy({
      username
    });

    if (user && await checkPassword(user, password)) {
      this.sendLoginResonse(res, user)
      return null;
    }

    res.status(401).json({
      success: false,
      code: 'posted_data_incorrect',
      message: errorMessage
    });
  }

  public async signupAction (req: Request, res: Response) {
    const { username, password, email } = req.body as {
      username: string,
      password: string,
      email: string
    }

    try {
      const user = await createUser(username, email, password)
      this.sendLoginResonse(res, user)
    } catch (e) {
      res.status(401).json({
        succes: false,
        code: 'create_user_failed',
        message: e.message
      })
    }

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

  private sendLoginResonse (res: Response, user: User) {
    const cookieOptions: CookieOptions = {
      sameSite: 'none',
      secure: true,
      signed: true
    }
    const cookie = generateAuthCookie(user);
    res.cookie('_t', cookie, cookieOptions)
      .cookie('_vapid', env('VAPID_PUBLIC_KEY'), cookieOptions)
      .json({
        success: true,
        user: {
          id: user.id,
          token: user.token,
          role: user.role,
          username: user.username,
          avatar: user.avatar
        },
        pushVapid: env('VAPID_PUBLIC_KEY')
      });
  }
}