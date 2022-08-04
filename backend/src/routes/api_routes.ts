import { Application, Router, Request, Response } from 'express'
import { MatchController } from '../controller/MatchController';
import apiTokenMiddleware from '../middelware/api_token_middleware'
import { buildRoute, registerHandlers } from '../service/routing_service';

const router = Router();
const baseEndpoint = '/api/v1/';

// setup middleware
apiTokenMiddleware(router);


// routes
const routes = [
  // - user

  // - match
  buildRoute(MatchController, 'todayMatchesAction', 'get', '/match/todays'),

];


export default function setup (app: Application) {
  app.use(baseEndpoint, registerHandlers(router, routes));
}