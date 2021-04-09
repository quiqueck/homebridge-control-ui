import { HapListener } from 'src'
import { Logger, LoggerConfig } from './Logger'
import { Server, Socket } from 'socket.io'

export interface IAPIServerConfig {
    port: number
    frontendURL: string
    logger: LoggerConfig
}

export class APIServer extends Logger {
    readonly config: IAPIServerConfig
    readonly listener: HapListener
    private io: Server | undefined

    constructor(listener: HapListener, options: IAPIServerConfig) {
        super(options.logger, 'APIServer')
        this.config = options
        this.listener = listener
    }

    start(): void {
        if (this.io === undefined) {
            this.l(`Starting Socket.IO on port ${this.config.port}`)
            this.io = new Server(this.config.port, {
                cors: {
                    origin: this.config.frontendURL,
                    methods: ['GET', 'POST'],
                    allowedHeaders: ['my-custom-header'],
                    credentials: true,
                },
            })

            this.io.use((socket: Socket, next) => {
                const token = socket.handshake.auth.token
                if (token != 'ga0kah2cah4ohX5ufaeK5ipoodeiR2ei') {
                    next(new Error('Client is not authorized'))
                } else {
                    this.l(`Authenticated ${socket.handshake.headers.referer}`)
                    next()
                }
            })
            this.io.emit('tweet', {})

            this.listener.start()
        }
    }
}
