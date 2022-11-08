import { Application, Router } from 'express'
import { AdminController } from '../controller/AdminController';
import { ChatController } from '../controller/ChatController';
import { CountryController } from '../controller/CountryController';
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
  buildRoute(UserController, 'pushNotificationSubscribeAction', 'post', '/user/push-subscribe'),
  buildRoute(UserController, 'pushNotificationUnsubscribeAction', 'get', '/user/push-unsubscribe'),
  buildRoute(UserController, 'vapidKeyAction', 'get', '/user/vapid-token'),

  // - match
  buildRoute(MatchController, 'todayMatchesAction', 'get', '/match/todays'),
  buildRoute(MatchController, 'allMatchesAction', 'get', '/match/all'),
  buildRoute(MatchController, 'placeTipAction', 'post', '/match/place-tip'),
  buildRoute(MatchController, 'updateMatchAction', 'put', '/match/:matchId'),
  buildRoute(MatchController, 'completedMatchesAction', 'get', '/match/completed'),

  // - country
  buildRoute(CountryController, 'allCountriesAction', 'get', '/country/all'),
  buildRoute(CountryController, 'updateCountryAction', 'put', '/country/:countryId'),

  // - tip
  buildRoute(TipController, 'scoreboardAction', 'get', '/tip/scoreboard'),
  buildRoute(TipController, 'myTotalScoreAction', 'get', '/tip/my-score'),
  buildRoute(TipController, 'userTotalScoreAction', 'get', '/tip/user-score/:user/:year?'),

  // - chat
  buildRoute(ChatController, 'getMyRoomsAction', 'get', '/chat/my-rooms'),
  buildRoute(ChatController, 'postRoomMessageAction', 'post', '/chat/message/:roomId'),

  // - admin
  buildRoute(AdminController, 'sendPushNotificationAction', 'post', '/admin/push-message'),
];


export default function setup (app: Application) {
  app.use(baseEndpoint, registerHandlers(router, routes));
}