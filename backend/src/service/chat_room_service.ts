import { In, Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { ChatRoom, ChatRoomType } from "../entity/ChatRoom";
import { UserChatRoom } from "../entity/UserChatRoom";
import { getRoomsLastMessage } from "./chat_message_service";


export const getChatRoomRepo = () => {
  return AppDataSource.getRepository(ChatRoom);
}

export const getUserChatRoomRepo = () => {
  return AppDataSource.getRepository(UserChatRoom);
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

export const findChatRoomByInternalId = async (internalId: string) => {
  return await getChatRoomRepo().findOneBy({
    internalId
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
  const roomMemberAvatar: { [id: number]: { avatar: string, username: string } } = {};

  // room other users
  (await getUserChatRoomRepo()
    .createQueryBuilder("userroom")
    .leftJoinAndSelect("userroom.user", "user")
    .leftJoinAndSelect("userroom.room", "room")
    .whereInIds(ids)
    .where("userroom.userId != :userId", { userId })
    .getMany()).forEach((room) => {
      if (!roomMemberAvatar[room.room.id]) {
        roomMemberAvatar[room.room.id] = {
          avatar: room.user.avatar,
          username: room.user.username
        }
      }
    })

  return rooms.map((room) => {
    const built = { id: 0, name: '', internalId: '', type: ChatRoomType.PUBLIC, members: [], avatar: '', lastMessage: null }
    built.id = room.id;
    built.internalId = room.internalId;
    built.name = room.name;
    built.type = room.type;
    built.avatar = room.avatar;

    if (room.type === ChatRoomType.ONE_TO_ONE && roomMemberAvatar[room.id]) {
      built.avatar = roomMemberAvatar[room.id].avatar;
      built.name = roomMemberAvatar[room.id].username
    }

    built.lastMessage = messages[room.id] || null;

    return built;
  })
}

export const getPublicRooms = async () => {
  return await getChatRoomRepo()
    .createQueryBuilder('room')
    .where("room.type = :type", { type: ChatRoomType.PUBLIC })
    .getMany();
}