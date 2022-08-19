import { Request, Response } from "express";
import { getUserRooms } from "../service/chat_room_service";
import { pluckUserFromRequest } from "../service/user_service";

export class ChatController {
  public async getMyRoomsAction (req: Request, res: Response) {
    const user = pluckUserFromRequest(req)

    return {
      success: true,
      rooms: await getUserRooms(user.id)
    }
  }
}