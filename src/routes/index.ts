import { Router } from 'express'
import { ApiRouter } from './api'
import { Server } from 'socket.io'

export default class MainRouter {
  router: Router

  constructor(private io: Server) {
    this.router = Router()
    this.init()
  }
  init() {
    this.router.use('/api', new ApiRouter(this.io).router)
  }
}
