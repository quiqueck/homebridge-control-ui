import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { IHapService } from '@/interfaces/IHapService'
import store from '@/store/'

@Module({ store, name: 'InstanceModule', dynamic: true })
export default class InstanceModule extends VuexModule {
    services: IHapService[] = [] // initialize empty for now
    connected: boolean = false

    get totalServices(): number {
        return this.services.length
    }

    @Mutation
    updateServices(services: IHapService[]) {
        this.services = services
    }

    @Mutation
    setConnected(ok: boolean) {
        this.connected = ok
    }

    // @Action({ commit: 'updateServices' })
    // async fetchServices() {
    //     const attempt = function() {
    //         if (client === undefined) {
    //             setTimeout(attempt, 1000)
    //         } else {
    //             client
    //                 .loadServices()
    //                 .then(services => {
    //                     return services
    //                 })
    //                 .catch(() => {})
    //         }
    //     }
    //     attempt()
    // }
}
