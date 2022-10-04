import { io, Socket } from 'socket.io-client'

export interface IMOptions {
  baseUrl: string
}

const log = (text: any) => console.log(`[socket]:${text}`)

export class IM {
  socket: Socket | undefined
  static instance: IM
  token: string | undefined

  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new IM()
    }
    return this.instance
  }

  load(options: IMOptions) {
    if (!this.socket) {
      this.socket = io(options.baseUrl)
      this.event()
    }
  }

  event() {
    this.socket?.on('connect', () => {
      log(`链接成功, ID: ${this.socket?.id}`)
    })
    this.socket?.on('disconnect', () => {
      log('链接断开')
    })
  }

  login(token: string) {
    if (this.token) return
    this.token = token
    this.sendMessage('login', { token })
  }

  logout() {
    this.sendMessage('logout', { token: this.token })
  }

  sendMessage<T>(key: string, value: T) {
    this.socket?.emit(key, value)
  }
}
