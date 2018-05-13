import { Router } from 'express'
import { ApiRouter } from './api'
import { Server } from 'socket.io'
import { Transporter } from 'nodemailer'

export default class MainRouter {
  router: Router

  constructor(private io: Server, private transporter: Transporter) {
    this.router = Router()
    this.init()
  }
  init() {
    this.router.use('/api', new ApiRouter(this.io, this.transporter).router)
  }
}
