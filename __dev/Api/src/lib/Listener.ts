import { Characteristics } from '@oznu/hap-client/dist/hap-types.js'
Characteristics['7195CE6D-8EE0-402E-BFCE-CB57C6A4AF2A'] = 'Input Source'
//console.log(Characteristics['0000005C-0000-1000-8000-0026BB765291'])
import { HapClient } from '@oznu/hap-client'

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

    private l(who: String, text: String) {
        this.config.logger.log(`[${who}] ${text}`)
    }

    private dl(who: String, text: String) {
        if (this.config.config.debug) {
            this.config.logger.log(`[DEBUG ${who}] ${text}`)
        }
    }

    private didDiscoverInstance(instance: IHapInstance) {
        this.stopInstanceWatchDog()

        this.l('Listener', `Bound to Instance ${instance.ipAddress}:${instance.port}`)
        this.instance = instance

        this.instanceWatchDog = setInterval(this.onInstanceWatchDog.bind(this), INSTANCE_WATCHDOG_INTERVAL)
    }

    private onInstanceWatchDog() {
        if (this.instance) {
            this.dl('WatchDog', `Testing connection to ${this.instance.ipAddress}:${this.instance.port}`)
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
