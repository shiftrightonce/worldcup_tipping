import { Application, Router, Request, Response } from 'express'

export type RouteEntry = {
  controller: Function,
  action: string,
  method: 'get' | 'post' | 'put' | 'delete',
  route: string
}

export function buildRoute (controller: Function, action: string, method: 'get' | 'post' | 'put' | 'delete', route: string): RouteEntry {
  return {
    controller,
    action,
    method,
    route
  }
}

export function registerHandlers (router: Router, routes: RouteEntry[] ): Router {
  routes.forEach(route => {
    (router as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
      const result = (new (route.controller as any))[route.action](req, res, next)
      if (result instanceof Promise) {
        result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

      } else if (result !== null && result !== undefined) {
        res.json(result)
      }
    })
  })

  return router;
}