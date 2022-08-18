import { AppDataSource } from "../data-source";
import { ChatGroup, ChatGroupType } from "../entity/ChatGroup";


export const getChatRoomRepo = () => {
  return AppDataSource.getRepository(ChatGroup);
}

export const createChatGroup = async (name: string, type = ChatGroupType.MULTIPLE) => {
  const group = new ChatGroup()

  group.name = name.trim();
  group.type = type;

  try {
    return await getChatRoomRepo().save(group);
  } catch (e) {
    return false;
  }
}

export const findChatGroupByName = async (name: string) => {
  return await getChatRoomRepo().findOneBy({
    name
  })
}

export const findChatGroupById = async (id: number) => {
  return await getChatRoomRepo().findOneBy({
    id
  })
}