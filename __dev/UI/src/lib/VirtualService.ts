import { HapServiceType, IHapService } from '@/interfaces/IHapService'
import { CharacteristicType } from '@oznu/hap-client'

export const serviceMapping = new Map()
serviceMapping.set('PM2_5Density', HapServiceType.vPM2_5Density)
serviceMapping.set('PM10Density', HapServiceType.vPM10Density)

export const serviceDependencyMapping = new Map()
serviceDependencyMapping.set('PM2_5Density', ['AirQuality'])
serviceDependencyMapping.set('PM10Density', ['AirQuality'])

export class VirtualService implements IHapService {
    private baseService: IHapService
    public readonly type: HapServiceType

    public static isDependencyOf(type: string, types: CharacteristicType[]): boolean {
        return (
            types
                .map(t => serviceDependencyMapping.get(t.type))
                .filter(t => t !== undefined)
                .flat(1)
                .indexOf(type) >= 0
        )
    }

    constructor(type: HapServiceType, base: IHapService) {
        this.baseService = base
        this.type = type
    }

    get serviceCharacteristics() {
        return this.baseService.serviceCharacteristics
    }

    get aid() {
        return this.baseService.aid
    }

    get iid() {
        return this.baseService.iid
    }

    get uuid() {
        return this.baseService.uuid
    }

    get humanType() {
        return this.baseService.humanType
    }

    get serviceName() {
        return this.baseService.serviceName
    }

    get linked() {
        return this.baseService.linked
    }

    get linkedServices() {
        return this.baseService.linkedServices
    }

    get hidden() {
        return this.baseService.hidden
    }

    get accessoryInformation() {
        return this.baseService.accessoryInformation
    }

    get refreshCharacteristics() {
        return this.baseService.refreshCharacteristics
    }

    get setCharacteristic() {
        return this.baseService.setCharacteristic
    }

    get getCharacteristic() {
        return this.baseService.getCharacteristic
    }

    get instance() {
        return this.baseService.instance
    }

    get uniqueId() {
        return this.baseService.uniqueId
    }

    get values() {
        return this.baseService.values
    }
}
