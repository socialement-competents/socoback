import { Router, Request, Response, NextFunction } from 'express'
import { Server } from 'socket.io'
import UserRouter from './users'
import MailRouter from './mails'
import { Transporter } from 'nodemailer'

export class ApiRouter {
  router: Router

  constructor(private io: Server, private transporter: Transporter) {
    this.router = Router()
    this.init()
  }

  private init() {
    this.router.use('/users', new UserRouter().router)
    this.router.use('/mails', new MailRouter(this.transporter).router)

    this.router.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err.name === 'ValidationError') {
          return res.status(422).json({
            errors: Object.keys(err.errors).reduce((errors: any, key) => {
              errors[key] = err.errors[key].message
              return errors
            }, {})
          })
        }

        return next(err)
      }
    )
  }
}
