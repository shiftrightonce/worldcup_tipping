import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { ChatMessage } from "../entity/ChatMessage";
import { cleanUserData } from "./user_service";

export const getChatMessageRepo = () => {
  return AppDataSource.getRepository(ChatMessage)
}

export const getRoomsLastMessage = async (roomIds: number[]): Promise<{ [roomId: number]: ChatMessage }> => {
  const result = {};
  (await getChatMessageRepo()
    .createQueryBuilder('message')
    .leftJoinAndSelect("message.room", "room")
    .leftJoinAndSelect("message.from", "user")
    .where({ room: In(roomIds) })
    .distinctOn(['message.roomId'])
    .orderBy({ 'message.createdAt': 'DESC' })
    .getMany()).forEach((message) => {
      message.from = cleanUserData(message.from)
      result[message.room.id] = message
    })

  return result

}
