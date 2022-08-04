import * as express from "express"
import * as bodyParser from "body-parser"
import { AppDataSource, env } from "./data-source"
import * as cookieParser from 'cookie-parser'
import * as  cors from 'cors'
import setupApiRoutes from './routes/api_routes'
import setupPublicRoutes from './routes/public_routes'


AppDataSource.initialize().then(async () => {

    // create express app
    const app = express();
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
    app.listen(PORT)


    console.log(`Express server has started on port ${PORT}`)

}).catch(error => console.log(error))
