import { CharacteristicType } from '@oznu/hap-client'
import { HapServiceType } from './IHapService'

export enum HapCharacteristicType {
    StatusActive = 'StatusActive',
    Unknown = '?'
}

export interface IHapCharacteristic extends CharacteristicType {
    type: HapCharacteristicType
    serviceType: HapServiceType
}
