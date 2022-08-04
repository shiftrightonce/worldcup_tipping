import { Router, Application } from "express";
import { PublicController } from "../controller/PublicController";
import { buildRoute, registerHandlers } from "../service/routing_service";

const router = Router();

const baseEndpoint = '/';

const routes = [
  buildRoute(PublicController, 'loginAction', 'post', '/user/login'),
];

export default function setup (app: Application) {
  app.use(baseEndpoint, registerHandlers(router, routes));
}