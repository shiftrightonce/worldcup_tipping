import { NextFunction, Request, Response } from "express"
import { AppDataSource } from '../data-source'
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
      const cookie = generateAuthCookie(user);
      res.cookie('_t', cookie).json({
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
}