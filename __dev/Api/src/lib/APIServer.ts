import { HapListener } from 'src'
import { Logger, LoggerConfig } from './Logger'
import { Server, Socket } from 'socket.io'
import { ServiceType } from '@oznu/hap-client'

export interface IAPIServerConfig {
    port: number
    frontendURL: string
    logger: LoggerConfig
}

export class APIServer extends Logger {
    readonly config: IAPIServerConfig
    readonly listener: HapListener
    private io: Server | undefined

    private lastSeenServices: ServiceType[] = []

    constructor(listener: HapListener, options: IAPIServerConfig) {
        super(options.logger, 'APIServer')
        this.config = options
        this.listener = listener
    }

    start(): void {
        if (this.io === undefined) {
            const self = this
            this.l(`Starting Socket.IO on port ${this.config.port}`)
            this.io = new Server(this.config.port, {
                cors: {
                    origin: this.config.frontendURL,
                    methods: ['GET', 'POST'],
                    allowedHeaders: ['my-custom-header'],
                    credentials: true,
                },
            })
            this.io.on('connection', (socket: Socket) => {
                this.l(`Connected to ${socket.handshake.headers.referer}`)
                self._emitServices(socket)
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
            this.listener.onServiceListChange = this.onServiceListChange.bind(this)
            this.listener.onServiceChange = this.onServiceChange.bind(this)

            this.listener.start()
        }
    }

    private _emitServices(socket?: Socket) {
        if (socket) {
            this.dl(`Sending all Services to ${socket.handshake.headers.referer}`)
            socket.emit('update_services', this.lastSeenServices)
        } else {
            this.dl(`Broadcasting all Services`)
            this.io?.emit('update_services', this.lastSeenServices)
        }
    }

    private _emitChangedServices(services: ServiceType[], socket?: Socket) {
        if (socket) {
            this.dl(`Sending changed Services (${services.length}) to ${socket.handshake.headers.referer}`)
            socket.emit('changed_services', services)
        } else {
            this.dl(`Broadcasting changed Services (${services.length})`)
            this.io?.emit('changed_services', services)
        }
    }

    onServiceListChange(services: ServiceType[]): void {
        this.l(`New Service list available (count: ${services.length})`)
        this.lastSeenServices = services
        this._emitServices()
    }

    onServiceChange(services: ServiceType[]): void {
        this.l(`Services changed (count: ${services.length})`)
        this.lastSeenServices = this.lastSeenServices.map((s) => {
            const ns = services.find((ss) => ss.uniqueId === s.uniqueId)
            return ns ? ns : s
        })
        //console.log(services.map((s) => this.lastSeenServices.find((ss) => ss.uniqueId === s.uniqueId)).filter((s) => s !== undefined))
        this._emitChangedServices(services)
    }
}
