import {
  Router,
  Response,
  Request,
  NextFunction
} from 'express'

import { User, IUser } from '../../models/User'
import { auth } from '../auth'

const profileRouter: Router = Router()

interface IReqProfile extends Request {
  profile?: IUser
  // TODO: add params type
}

export default class ProfileRouter {
  public router: Router

  constructor() {
    this.router = Router()
    this.init()
  }
  private init() {
    this.router.param(
      'username',
      async (
        req: IReqProfile,
        res: Response,
        next: NextFunction,
        username: string
      ) => {
        try {
          const user = await User.findOne({ username: username })
          if (!user) {
            return res.sendStatus(404)
          }

          req.profile = user

          return next()
        } catch (e) {
          return next(e)
        }
      }
    )

    this.router.get(
      '/:username/:id',
      auth.optional,
      async (req: IReqProfile, res: Response, next: NextFunction) => {
        try {
          const user = await User.findById(req.params.id)

          if (!user) {
            return res.json({ profile: req.profile.toProfileJSONFor(user) })
          }

          return res.json({ profile: req.profile.toProfileJSONFor(user) })
        } catch (e) {
          // TODO: handle exceptions
        }
      }
    )

    this.router.post(
      '/:username/follow',
      auth.required,
      async (req: IReqProfile, res: Response, next: NextFunction) => {
        const profileId = req.profile._id

        try {
          const user = await User.findById(req.params.id)

          if (!user) {
            return res.sendStatus(401)
          }

          try {
            await user.follow(profileId)
            return res.json({ profile: req.profile.toProfileJSONFor(user) })
          } catch (e) {
            // TODO: handle exceptions
          }
        } catch (e) {
          return next(e)
        }
      }
    )

    this.router.delete(
      '/:username/follow/:id',
      auth.required,
      async (req: IReqProfile, res: Response, next: NextFunction) => {
        const profileId = req.profile._id

        try {
          const user = await User.findById(req.params.id)

          if (!user) {
            return res.sendStatus(401)
          }

          try {
            await user.unfollow(profileId)
            return res.json({ profile: req.profile.toProfileJSONFor(user) })
          } catch (e) {
            // TODO: handle exceptions
          }
        } catch (e) {
          return next(e)
        }
      }
    )
  }
}
