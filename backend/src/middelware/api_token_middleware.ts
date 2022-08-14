import { Router, Request, Response } from 'express'
import { User } from '../entity/User'
import { authenticateToken, authenticateAuthCookie } from '../service/user_service'

const cleanCookieValue = (req: Request, cookieName: string): string => {
  if (req.signedCookies[cookieName]) {
    const value = req.signedCookies[cookieName].split(';')[0].trim()
    return value
  }
  return ''
}

const pluckTokenAndRole = (req: Request): { rawToken: string, roleInternalId: string } => {
  const rawToken = (req.headers.authorization || req.query._t?.toString() || '').replace('Bearer ', '').trim()
  const roleInternalId = req.headers.role || req.query._r?.toString() || cleanCookieValue(req, '_r')

  return {
    rawToken,
    roleInternalId: roleInternalId as string
  }
}

const doAuthenticate = async (req: Request) => {
  const { rawToken, roleInternalId } = pluckTokenAndRole(req)
  return (rawToken) ? await authenticateToken(rawToken) : await authenticateAuthCookie(cleanCookieValue(req, '_t'))
}

export default (router: Router) => {
  router.use(async (req: Request, res: Response, next: Function) => {
    try {
      const user = await doAuthenticate(req)

      if (user) {
        (req as { authUser?: User }).authUser = user;
        return next()
      }

      res.status(401).json({
        success: false,
        code: 'permission_denied',
        message: 'Permission denied'
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        code: 'authentication_failed',
        message: 'authentication by token failed'
      })
    }
  })
}