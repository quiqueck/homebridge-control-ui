import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { IHapService } from '@/interfaces/IHapService'
import { CharacteristicType } from '@oznu/hap-client'

@Module({ name: 'InstanceModule' })
export default class InstanceModule extends VuexModule {
    services: IHapService[] = [] // initialize empty for now

    get totalServices(): number {
        return this.services.length
    }

    get characteristics(): CharacteristicType[] {
        return this.services.map((s) => s.serviceCharacteristics).flat(1)
    }

    @Mutation
    SOCKET_UPDATE_SERVICES(services: IHapService[]) {
        console.log('SOCKET_UPDATE_SERVICES')
        this.services = services
    }

    @Mutation
    SOCKET_CHANGED_SERVICES(chgServices: IHapService[]) {
        console.log('SOCKET_UPDATE_SERVICES')
        this.services = this.services.map((s) => {
            const ns = chgServices.find((ss) => ss.uniqueId === s.uniqueId)
            return ns ? ns : s
        })
    }

    // @Action({})
    // async socket_updateServices() {
    //     console.log('socket_updateServices')
    // }

    // @Action({ commit: 'updateServices' })
    // async fetchServices() {
    //     const self = this;
    //     const attempt = function () {
    //         if (self.client === undefined) {
    //             setTimeout(attempt, 1000)
    //         } else {
    //             self.client
    //                 .loadServices()
    //                 .then((services) => {
    //                     return services
    //                 })
    //                 .catch(() => {})
    //         }
    //     }
    //     attempt()
    // }
}
