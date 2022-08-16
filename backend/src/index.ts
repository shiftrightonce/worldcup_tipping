import * as express from "express"
import * as bodyParser from "body-parser"
import { AppDataSource, env } from "./data-source"
import * as cookieParser from 'cookie-parser'
import * as  cors from 'cors'
import setupApiRoutes from './routes/api_routes'
import setupPublicRoutes from './routes/public_routes'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'


AppDataSource.initialize().then(async () => {

    // create express app
    const app = express();
    const httpServer = createServer(app)
    const io = new Server(httpServer, {
        cors: {
            origin: env('SOCKETIO_CORS', '').split(',')
        }
    })

    // redis adapter
    const socketIOPubClient = createClient({ url: env('REDIS_URL', 'redis://redisdbbad') })
    const socketIOSubClient = socketIOPubClient.duplicate()
    io.adapter(createAdapter(socketIOPubClient, socketIOSubClient))

    io.on("connection", (socket) => {
        console.log("connection: " + socket.id)
    })

    app.use(cors({
        origin: true,
        credentials: true
    }));
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser(process.env.COOKIE_SECRET || `random${Date.now()}`));

    // register api routes
    setupApiRoutes(app);

    // register public routes
    setupPublicRoutes(app);

    // start express server
    const PORT = env('SERVER_PORT', 3000);
    // app.listen(PORT)

    httpServer.listen(PORT)

    console.log(`Express server has started on port ${PORT}`)

}).catch(error => console.log(error))
