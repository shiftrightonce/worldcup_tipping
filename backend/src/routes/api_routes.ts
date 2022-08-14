import { Application, Router } from 'express'
import { MatchController } from '../controller/MatchController';
import { TipController } from '../controller/TipController';
import { UserController } from '../controller/UserController';
import apiTokenMiddleware from '../middelware/api_token_middleware'
import { buildRoute, registerHandlers } from '../service/routing_service';

const router = Router();
const baseEndpoint = '/api/v1/';

// setup middleware
apiTokenMiddleware(router);


// routes
const routes = [
  // - user
  buildRoute(UserController, 'getMatchTipAction', 'get', '/user/tip/:match'),

  // - match
  buildRoute(MatchController, 'todayMatchesAction', 'get', '/match/todays'),
  buildRoute(MatchController, 'placeTipAction', 'post', '/match/place-tip'),
  buildRoute(MatchController, 'completedMatchesAction', 'get', '/match/completed'),

  // - tip
  buildRoute(TipController, 'scoreboardAction', 'get', '/tip/scoreboard'),
  buildRoute(TipController, 'userTotalScoreAction', 'get', '/tip/user-score/:user'),

];


export default function setup (app: Application) {
  app.use(baseEndpoint, registerHandlers(router, routes));
}