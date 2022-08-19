import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { ChatRoom, ChatRoomType } from "../entity/ChatRoom";
import { getRoomsLastMessage } from "./chat_message_service";
import { cleanUserData } from "./user_service";


export const getChatRoomRepo = () => {
  return AppDataSource.getRepository(ChatRoom);
}

export const createChatRoom = async (name: string, type = ChatRoomType.PUBLIC) => {
  const group = new ChatRoom()

  group.name = name.trim();
  group.type = type;

  try {
    return await getChatRoomRepo().save(group);
  } catch (e) {
    return false;
  }
}

export const findChatRoomByName = async (name: string) => {
  return await getChatRoomRepo().findOneBy({
    name
  })
}

export const findChatRoomById = async (id: number) => {
  return await getChatRoomRepo().findOneBy({
    id
  })
}

export const getUserRooms = async (userId: number) => {
  const rooms = await getChatRoomRepo()
    .createQueryBuilder('room')
    .leftJoinAndSelect("room.members", "members")
    .leftJoinAndSelect("members.user", "members_user")
    .where("room.type = :type", { type: ChatRoomType.PUBLIC })
    .orWhere("members.userId = :userId", { userId })
    .orderBy("room.type", 'DESC')
    .getMany()

  const ids = rooms.map((room) => room.id);
  const messages = (ids.length) ? await getRoomsLastMessage(ids) : {}

  return rooms.map((room) => {
    const built = { id: 0, name: '', type: ChatRoomType.PUBLIC, members: [], lastMessage: null }
    built.id = room.id
    built.name = room.name
    built.type = room.type
    built.members = room.members.filter((member) => member.user.id !== userId).map((member) => cleanUserData(member.user))

    built.lastMessage = messages[room.id] || null

    return built
  })
}