import { NextFunction, Request, Response, CookieOptions } from "express"
import path = require("path");
import { checkPassword, createUser, generateAuthCookie, getUserRepo, sendLoginResonse } from "../service/user_service";

export class PublicController {

  public async indexAction (req: Request, res: Response) {
    return 'Index Page. Coming soon';
  }

  public async loginAction (req: Request, res: Response) {
    const username = req.body.username || '';
    const password = req.body.password || '';
    const errorMessage = 'posted data is incorrect'

    let user = await getUserRepo().findOneBy({
      username
    });

    if (!user) {
      user = await getUserRepo().findOneBy({
        email: username
      })
    }

    if (user && await checkPassword(user, password)) {
      sendLoginResonse(res, user)
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
      sendLoginResonse(res, user);
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

  public prizesAction (_: Request, res: Response) {
    return {
      success: true,
      prizes: [
        {
          image: '/static/prizes/1st_place.jpg',
          title: 'First Place',
          position: 1,
          description: ''
        },
        {
          image: '/static/prizes/2nd_place.jpg',
          title: 'Second Place',
          position: 2,
          description: ''
        },
        {
          image: '/static/prizes/3rd_place.jpg',
          title: 'Third Place',
          position: 3,
          description: ''
        }
      ]
    }
  }
}