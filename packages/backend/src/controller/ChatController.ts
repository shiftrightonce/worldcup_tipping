import { Request } from "express";
import { ChatMessageType } from "../entity/ChatMessage";
import { postMessage } from "../service/chat_message_service";
import { getUserRooms } from "../service/chat_room_service";
import { pluckUserFromRequest } from "../service/user_service";

export class ChatController {
  public async getMyRoomsAction (req: Request) {
    const user = pluckUserFromRequest(req)

    return {
      success: true,
      rooms: await getUserRooms(user.id)
    }
  }

  public async postRoomMessageAction (req: Request) {
    const user = pluckUserFromRequest(req)
    const message = (req.body as { message: string }).message
    const type = (req.body as { type?: ChatMessageType }).type || ChatMessageType.MESSAGE

    return {
      success: true,
      message: await postMessage(req.params.roomId, user, message, type)
    }
  }
}