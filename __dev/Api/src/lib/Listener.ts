import { Characteristics } from '@oznu/hap-client/dist/hap-types.js'
Characteristics['7195CE6D-8EE0-402E-BFCE-CB57C6A4AF2A'] = 'Input Source'
//console.log(Characteristics['0000005C-0000-1000-8000-0026BB765291'])
import { HapClient, ServiceType } from '@oznu/hap-client'
import axios from 'axios'
import { HapMonitor } from '@oznu/hap-client/dist/monitor'
import { Logger, LoggerConfig } from './Logger'

const INSTANCE_WATCHDOG_INTERVAL = 30 * 1000
const CLIENT_WATCHDOG_INTERVAL = 90 * 1000
export interface IHapListenerConfig {
    pin: string
    logger: LoggerConfig
    config: {
        debug: boolean
    }
}

export interface IHapInstance {
    name: string
    username: string
    ipAddress: string
    port: number
    services: any[]
    connectionFailedCount: number
}

export class HapListener extends Logger {
    readonly config: IHapListenerConfig
    constructor(options: IHapListenerConfig) {
        super(options.logger, 'Listener')
        this.config = options
        this.onServiceListChange = () => {}
    }

    private hapClient: HapClient | undefined
    private instance: IHapInstance | undefined
    private instanceWatchDog: NodeJS.Timeout | undefined
    private clientWatchDog: NodeJS.Timeout | undefined
    private monitor: HapMonitor | undefined

    onServiceListChange: (services: ServiceType[]) => void

    private async onServiceUpdate(services: ServiceType[]) {
        this.l('Monitor', `Service Update received for '${services.map((s) => `${s.serviceName} (${JSON.stringify(s.values)})`).join(',')}'`)
        //console.log(services)
    }

    private async didDiscoverInstance(instance: IHapInstance) {
        this.stopClientWatchDog()
        this.stopInstanceWatchDog()

        this.l(`Bound to Instance ${instance.ipAddress}:${instance.port}`)
        this.instance = instance

        this.instanceWatchDog = setInterval(this.onInstanceWatchDog.bind(this), INSTANCE_WATCHDOG_INTERVAL)

        if (this.monitor === undefined) {
            this.l(`Starting Monitor`)
            this.monitor = await this.hapClient?.monitorCharacteristics()
            this.monitor?.on('service-update', this.onServiceUpdate.bind(this))
            this.monitor?.start()
        }
    }

    private async checkInstanceConnection(instance: IHapInstance): Promise<boolean> {
        try {
            await axios.put(
                `http://${instance.ipAddress}:${instance.port}/characteristics`,
                {
                    characteristics: [{ aid: -1, iid: -1 }],
                },
                {
                    headers: {
                        Authorization: this.config.pin,
                    },
                }
            )
            return true
        } catch (e) {
            this.dl(`[${instance.ipAddress}:${instance.port} (${instance.username})] returned an error while attempting connection: ${e.message}`)
            return false
        }
    }

    private async onInstanceWatchDog() {
        if (this.instance) {
            this.dl('WatchDog', `Testing connection to ${this.instance.ipAddress}:${this.instance.port}`)
            const ok = await this.checkInstanceConnection(this.instance)
            this.dl('WatchDog', `Connection to ${this.instance.ipAddress}:${this.instance.port} ${ok ? 'is OK' : 'FAILED'}`)
            if (!ok) {
                this.start()
            }
        }
    }

    private stopInstanceWatchDog() {
        if (this.instanceWatchDog) {
            clearInterval(this.instanceWatchDog)
            this.instanceWatchDog = undefined
        }
    }

    private async onClientWatchDog() {
        if (this.instance === undefined && this.hapClient) {
            this.dl('WatchDog', `Retrigger Discovery`)
            this.hapClient.refreshInstances()
        }
    }

    private stopClientWatchDog() {
        if (this.clientWatchDog) {
            clearInterval(this.clientWatchDog)
            this.clientWatchDog = undefined
        }
    }

    public stop() {
        this.stopClientWatchDog()
        this._stop()
    }

    private _stop(): void {
        this.stopInstanceWatchDog()
        if (this.monitor) {
            this.monitor.finish()
            this.monitor.off('service-update', this.onServiceUpdate.bind(this))
            this.monitor = undefined
        }

        if (this.hapClient) {
            this.hapClient.off('instance-discovered', this.didDiscoverInstance.bind(this))
            this.hapClient = undefined
            this.instance = undefined
        }
    }

    start(): void {
        this._stop()

        if (this.clientWatchDog === undefined) {
            this.clientWatchDog = setInterval(this.onClientWatchDog.bind(this), CLIENT_WATCHDOG_INTERVAL)
        }

        if (this.hapClient === undefined) {
            this.hapClient = new HapClient(this.config)
            this.hapClient.on('instance-discovered', this.didDiscoverInstance.bind(this))
        } else {
            this.hapClient.refreshInstances()
        }
    }
}
