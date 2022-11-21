import { Server } from "socket.io";
import { authenticateToken } from './service/user_service'
import { getRedisConnection } from './redis_client'
import { getPublicRooms } from "./service/chat_room_service";
import { ChatRoomType } from "./entity/ChatRoom";
import { JobPayload } from "./jobs/process_chat_data";
import { env } from "./data-source";

export const CHAT_MESSAGE_REDIS_QUEUE = 'chat:redis_queue';

export const CHAT_ACTION_ROOM_MESSAGE = 'room_message';
export const NOTIFICATION_MESSAGE = 'notification_message';
export const NOTIFICATION_ROOM = 'notification';

const inDevMode = env('ENV') === 'development';

export default async (io: Server) => {
    const redisConnection = await getRedisConnection();
    const rooms: Record<string, ChatRoomType> = {};
    const publicRooms: string[] = [
        NOTIFICATION_ROOM  // notification room
    ];

    (await getPublicRooms()).forEach((room) => {
        rooms[room.internalId] = room.type;
        publicRooms.push(room.internalId);
    })

    const onChatMessage = (data: JobPayload) => {
        switch (data.action) {
            case NOTIFICATION_MESSAGE:
                io.to(NOTIFICATION_ROOM).emit(`server:${NOTIFICATION_MESSAGE}`, data);
                break;
            default:
                io.to(data.roomId).emit('server:room_event', data);
        }
    }

    const listenForJob = () => {
        redisConnection.executeIsolated(async (c) => {
            const job = await c.blPop(CHAT_MESSAGE_REDIS_QUEUE, 0);
            if (job.element) {
                onChatMessage(JSON.parse(job.element));
            }
            setTimeout(listenForJob, 0)
        })
    }

    setTimeout(listenForJob, 1000);

    io.use(async (socket, next) => {
        const error: Error & { data?: string } = new Error('unauthorized')

        if (!socket.handshake.auth.token) {
            return next(error)
        }

        const user = await authenticateToken(socket.handshake.auth.token)

        if (!user) {
            return next(error)
        }

        socket.on('disconnect', (reason) => {
            if (inDevMode) {
                console.log('disconnecting', reason)
            }
        });

        // join public rooms
        publicRooms.forEach((room) => {
            socket.join(room);
        })

        // personal room
        socket.join(user.internalId);

        return next()
    })

    io.on("connection", (socket) => {
        if (inDevMode) {
            console.log("connection: " + socket.id)
        }

        // server time
        socket.emit('server:time', Date.now())
    })
}