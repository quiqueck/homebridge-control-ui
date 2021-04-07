import { Characteristics } from '@oznu/hap-client/dist/hap-types.js'
Characteristics['7195CE6D-8EE0-402E-BFCE-CB57C6A4AF2A'] = 'Input Source'
//console.log(Characteristics['0000005C-0000-1000-8000-0026BB765291'])
import { HapClient, ServiceType } from '@oznu/hap-client'
import axios from 'axios'
import { HapMonitor } from '@oznu/hap-client/dist/monitor'

const INSTANCE_WATCHDOG_INTERVAL = 30 * 1000
export interface IHapListenerConfig {
    pin: string
    logger: any
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

export class HapListener {
    readonly config: IHapListenerConfig
    constructor(options: IHapListenerConfig) {
        this.config = options
    }

    private hapClient: HapClient | undefined
    private instance: IHapInstance | undefined
    private instanceWatchDog: NodeJS.Timeout | undefined
    private monitor: HapMonitor | undefined

    private l(who: String, text: String) {
        this.config.logger.log(`[${who}] ${text}`)
    }

    private dl(who: String, text: String) {
        if (this.config.config.debug) {
            this.config.logger.log(`[DEBUG ${who}] ${text}`)
        }
    }

    private async onServiceUpdate(services: ServiceType[]) {
        this.l('Monitor', `Service Update received for '${services.map((s) => `${s.serviceName} (${JSON.stringify(s.values)})`).join(',')}'`)
        //console.log(services)
    }

    private async didDiscoverInstance(instance: IHapInstance) {
        this.stopInstanceWatchDog()

        this.l('Listener', `Bound to Instance ${instance.ipAddress}:${instance.port}`)
        this.instance = instance

        this.instanceWatchDog = setInterval(this.onInstanceWatchDog.bind(this), INSTANCE_WATCHDOG_INTERVAL)

        if (this.monitor === undefined) {
            this.l('Listener', `Starting Monitor`)
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
            this.dl('Listener', `[${instance.ipAddress}:${instance.port} (${instance.username})] returned an error while attempting connection: ${e.message}`)
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

    stop(): void {
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
        this.stop()

        this.hapClient = new HapClient(this.config)
        this.hapClient.on('instance-discovered', this.didDiscoverInstance.bind(this))
    }
}
