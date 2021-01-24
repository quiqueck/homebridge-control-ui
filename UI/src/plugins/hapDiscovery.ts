import { PluginFunction } from 'vue'
import _Vue from 'vue'
import store from '@/store'
import InstanceModule from '@/store/InstanceModule'
import axios, { AxiosResponse } from 'axios'
import { IHapService } from '@/interfaces/IHapService'
import { getModule } from 'vuex-module-decorators'

const instanceModule = getModule(InstanceModule)

export interface UserHapDiscoveryPreset {
    host: string
    port: number
    username: string
    password: string
    refreshTimer: number
    retryTimer: number
    maxRetries: number
}
let client: HapDiscovery | undefined = undefined
export class HapDiscovery {
    constructor(options: UserHapDiscoveryPreset) {
        this.config = options
        this.baseURL = `http://${this.config.host}:${this.config.port}`
    }

    private baseURL: string
    u(sub: string) {
        return `${this.baseURL}${sub}`
    }
    private config: UserHapDiscoveryPreset
    //private _token: string
    private _reqCfg: any

    static install: PluginFunction<UserHapDiscoveryPreset> = (Vue: typeof _Vue, options?: UserHapDiscoveryPreset) => {
        if (options === undefined) {
            console.error('Pleas configure the HapClient!')
            return
        }

        client = new HapDiscovery(options)
        client.authenticate().then(() => {
            console.log('[HapClient] authenticated')
            client?.loadServices().then((services: IHapService[]) => {
                instanceModule.updateServices(services.sort((a, b) => a.serviceName.localeCompare(b.serviceName)))
            })
        })
    }
    static version: string = '1.0.0'

    authenticate(): Promise<any> {
        const self = this
        return new Promise<any>((resolve, reject) => {
            axios
                .post(this.u('/api/auth/login'), {
                    username: this.config.username,
                    password: this.config.password,
                    otp: ''
                })
                .then((response: AxiosResponse<any>) => {
                    self._handleAuth(response)
                    resolve(undefined)
                })
                .catch(err => {
                    console.error(err)
                    reject(err)
                })
        })
    }

    private _handleAuth(response: AxiosResponse<any>): void {
        //console.log('[_handleAuth]', response.status, response.statusText, response.data)
        if (response.status === 201) {
            //this._token = response.data.access_token
            this._reqCfg = {
                headers: {
                    Authorization: `Bearer ${response.data.access_token}`
                }
            }
        } else {
            console.error('Authentication failed')
        }
    }

    async checkAuth() {
        try {
            const r = await axios.get(this.u('/api/auth/check'), this._reqCfg)
            if (r.status === 401) {
                return false
            } else if (r.status === 200) {
                if (r.data.status === 'OK') {
                    return true
                } else {
                    console.error('[checkAuth] Auth not OK', r.data)
                }
            } else {
                console.error('[checkAuth] Unexpected answer', r.status, r.statusText, r.data)
            }
        } catch (err) {
            console.error('[checkAuth]', err)
        }
        return false
    }

    async authOrRetry(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let count = this.config.maxRetries
            const self = this
            const attempt = function() {
                if (count <= 0) {
                    reject()
                } else {
                    if (self.checkAuth()) {
                        resolve()
                    } else {
                        console.error('[AuthFail] Retry in ', self.config.retryTimer / 1000, 's')
                        count--
                        setTimeout(function() {
                            self.authenticate()
                                .then(attempt)
                                .catch(attempt)
                        }, self.config.retryTimer)
                    }
                }
            }
            attempt()
        })
    }
    private services: IHapService[] = []
    loadServices(): Promise<IHapService[]> {
        return new Promise<IHapService[]>((resolve, reject) => {
            this.authOrRetry().then(async () => {
                try {
                    const r = await axios.get(this.u('/api/accessories'), this._reqCfg)
                    if (r.status === 200) {
                        this.services = r.data
                        resolve(this.services)
                    } else {
                        console.error('[loadServices] Unexpected answer', r.status, r.statusText, r.data)
                        reject(``)
                    }
                } catch (err) {
                    console.error('[loadServices]', err.response.data)
                    reject()
                }
            })
        })
    }
}

const inConfig = {
    host: '192.168.55.21',
    port: 8080,
    username: 'houseapi',
    password: 'chieph9fohdejuch1Wu1lee3equ7weeh',
    refreshTimer: 1000 * 60 * 5,
    retryTimer: 1000 * 2,
    maxRetries: 10
}

_Vue.use(HapDiscovery, inConfig)

export default client
