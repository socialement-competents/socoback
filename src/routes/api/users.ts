import * as express from 'express'
import * as passport from 'passport'
import * as LocalStrategy from 'passport-local'

import { User, IUser } from '../../models/User'
import { auth } from '../auth'

passport.use(
  new LocalStrategy.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email })

        if (!user || !user.validPassword(password)) {
          return done(undefined, false, {
            message: 'email or password is invalid'
          })
        }

        return done(undefined, user)
      } catch (e) {
        done(e)
      }
    }
  )
)

export default class UserRouter {
  public router: express.Router

  constructor() {
    this.router = express.Router()
    this.init()
  }
  private init() {
    this.router.get(
      '/:id',
      auth.required,
      async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        try {
          const user = await User.findById(req.params.id)
          return res.json(user.toAuthJSON())
        } catch (e) {
          return next(e)
        }
      }
    )

    this.router.put(
      '/:id',
      auth.required,
      async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        try {
          const user = await User.findById(req.params.id)
          if (!user) {
            return res.sendStatus(401)
          }
          // only update fields that were actually passed...
          if (typeof req.body.lastname !== 'undefined')
            user.lastname = req.body.lastname
          if (typeof req.body.firstname !== 'undefined')
            user.firstname = req.body.firstname
          if (typeof req.body.email !== 'undefined')
            user.email = req.body.email
          if (typeof req.body.bio !== 'undefined')
            user.bio = req.body.bio
          if (typeof req.body.image !== 'undefined')
            user.image = req.body.image
          if (typeof req.body.password !== 'undefined')
            user.setPassword(req.body.password)

          try {
            await user.save()
            return res.json(user.toAuthJSON())
          } catch (e) {
            // TODO: handle exceptions
            return next(e)
          }
        } catch (e) {
          return next(e)
        }
      }
    )

    this.router.post(
      '/login',
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        if (!req.body.email) {
          return res.status(422).json({ errors: { email: "can't be blank" } })
        }

        if (!req.body.password) {
          return res
            .status(422)
            .json({ errors: { password: "can't be blank" } })
        }

        passport.authenticate(
          'local',
          { session: false },
          (err: any, user: IUser, info: any) => {
            if (err) {
              return next(err)
            }

            if (user) {
              user.token = user.generateJWT()
              return res.json(user.toAuthJSON())
            } else {
              return res.status(422).json(info)
            }
          }
        )(req, res, next)
      }
    )

    this.router.post(
      '/',
      async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        const user = new User()

        user.lastname = req.body.lastname
        user.firstname = req.body.firstname
        user.email = req.body.email
        user.setPassword(req.body.password)

        try {
          await user.save()
          return res.json(user.toAuthJSON())
        } catch (e) {
          return next(e)
        }
      }
    )
  }
}
