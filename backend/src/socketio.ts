import { Server } from "socket.io";
import { authenticateToken } from './service/user_service'
import { getRedisConnection } from './redis_client'

export default async (io: Server) => {
    console.log("we are in here")
    const redisConnection = await getRedisConnection();

    const val = await redisConnection.get('foo');

    console.log('redis foo value: ' + val);

    if (!val) {
        await redisConnection.set('foo', 'testing persisiting')
    }

    io.use(async (socket, next) => {
        const error: Error & { data?: string } = new Error('unauthorized')

        if (!socket.handshake.auth.token) {
            return next(error)
        }

        const user = await authenticateToken(socket.handshake.auth.token)

        if (!user) {
            return next(error)
        }

        return next()
    })

    io.on("connection", (socket) => {
        console.log("connection: " + socket.id)
        console.log('click data: ', socket.data)

        // server time
        socket.emit('server:time', Date.now())
    })
}