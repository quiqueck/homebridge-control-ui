import { Characteristics } from '@oznu/hap-client/dist/hap-types.js'
Characteristics['7195CE6D-8EE0-402E-BFCE-CB57C6A4AF2A'] = 'Input Source'
console.log(Characteristics['0000005C-0000-1000-8000-0026BB765291'])
//import { HapClient } from '@oznu/hap-client'

export interface IHapListenerConfig {
    pin: string
    logger: any
    config: {
        debug: boolean
    }
}

export class HapListener {
    readonly config: IHapListenerConfig
    constructor(options: IHapListenerConfig) {
        this.config = options
    }

    start(): void {}
}
