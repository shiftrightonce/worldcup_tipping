import { Router, Application } from "express";
import { PublicController } from "../controller/PublicController";
import { buildRoute, registerHandlers } from "../service/routing_service";

const router = Router();

const baseEndpoint = '/api';

const routes = [
  buildRoute(PublicController, 'loginAction', 'post', '/user/login'),
  buildRoute(PublicController, 'logoutAction', 'get', '/user/logout'),
  buildRoute(PublicController, 'signupAction', 'post', '/user/signup'),
  buildRoute(PublicController, 'prizesAction', 'get', '/prizes'),
];

const indexRouts = [
  buildRoute(PublicController, 'indexAction', 'get', '/'),
];

export default function setup (app: Application) {
  app.use(baseEndpoint, registerHandlers(router, routes));
  app.use('/', registerHandlers(router, indexRouts));
}