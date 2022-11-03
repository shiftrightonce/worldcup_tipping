import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { ChatMessage, ChatMessageType } from "../entity/ChatMessage";
import { ChatRoomType } from "../entity/ChatRoom";
import { User } from "../entity/User";
import { queueRoomMessage } from "../jobs/process_chat_data";
import { findChatRoomById, findChatRoomByInternalId } from "./chat_room_service";
import { cleanUserData, getUserById } from "./user_service";

export const getChatMessageRepo = () => {
  return AppDataSource.getRepository(ChatMessage)
}

export const getRoomsLastMessage = async (roomIds: number[], messageType = ChatMessageType.MESSAGE): Promise<{ [roomId: number]: ChatMessage }> => {
  const result = {};
  (await getChatMessageRepo()
    .createQueryBuilder('message')
    .leftJoinAndSelect("message.room", "room")
    .leftJoinAndSelect("message.from", "user")
    .where({ room: In(roomIds) })
    .where("message.type = :type", { type: messageType })
    .distinctOn(['message.roomId'])
    .orderBy({ 'message.createdAt': 'DESC' })
    .getMany()).forEach((message) => {
      message.from = cleanUserData(message.from)
      result[message.room.internalId] = message
    })

  return result

}

export const postMessage = async (roomId: string | number, sender: User | number, message: string, type = ChatMessageType.MESSAGE) => {
  let chatMessage = new ChatMessage()

  const room = (typeof roomId === 'string') ? await findChatRoomByInternalId(roomId) : await findChatRoomById(roomId)
  const user = (typeof sender === 'number') ? await getUserById(sender) : sender;

  if (user && room) {

    chatMessage.type = type
    chatMessage.room = room;
    chatMessage.from = user
    chatMessage.message = message

    chatMessage = await getChatMessageRepo().save(chatMessage);
    chatMessage.from = cleanUserData(chatMessage.from);
    setTimeout(() => {
      queueRoomMessage(room.internalId, chatMessage);
    }, 1000)
  }

  return chatMessage;
}
