import { PluginFunction } from 'vue'
import _Vue from 'vue'
import store from '@/store'
import InstanceModule from '@/store/InstanceModule'
import axios, { AxiosResponse } from 'axios'
import { IHapService } from '@/interfaces/IHapService'
import { getModule } from 'vuex-module-decorators'
import i18n from './i18n'
import { ErrorMessage } from '@/interfaces/IErrorMessage'

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

    private async get(sub: string) {
        return axios.get(this.u(sub), this._reqCfg)
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
                    instanceModule.setConnected(false)
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
            instanceModule.setConnected(true)
        } else {
            instanceModule.setConnected(false)
            console.error('Authentication failed')
        }
    }

    async checkAuth() {
        try {
            const r = await this.get('/api/auth/check')
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
                    instanceModule.setConnected(false)
                    reject()
                } else {
                    if (self.checkAuth()) {
                        instanceModule.setConnected(true)
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
    async loadServices(): Promise<IHapService[]> {
        await this.authOrRetry()
        try {
            const r = await axios.get(this.u('/api/accessories'), this._reqCfg)
            if (r.status === 200) {
                this.services = r.data
                return this.services
            } else {
                throw {
                    message: i18n.tc('Errors.hapDiscovery.loadService.unexpectedStatus'),
                    details: `${r.status} ${r.statusText}`,
                    sender: 'hapDiscovery.loadServices',
                    data: [r.status, r.statusText, r.data],
                    rethrow: true
                } as ErrorMessage
            }
        } catch (err) {
            instanceModule.setConnected(false)
            if (err.rethrow) {
                err.rethrow = false
                console.error('[loadServices]', err)
                throw err
            } else {
                console.error('[loadServices]', err.response.data)
                throw {
                    message: i18n.tc('Errors.hapDiscovery.loadService.failed'),
                    details: `${err.response.data.statusCode} ${err.response.data.message}`,
                    sender: 'hapDiscovery.loadServices',
                    data: err.response.data
                } as ErrorMessage
            }
        }
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
