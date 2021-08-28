import { IHapService } from '@/interfaces/IHapService'
import { CharacteristicType } from '@oznu/hap-client'

declare global {
    interface String {
        padZero(length: number): string
    }
    interface Number {
        padZero(length: number): string
        formatFloat(postfix?: string): string
    }
}

String.prototype.padZero = function(length: number) {
    let d = String(this)
    while (d.length < length) {
        d = '0' + d
    }
    return d
}

Number.prototype.padZero = function(length: number) {
    let d = String(this)
    while (d.length < length) {
        d = '0' + d
    }
    return d
}

Number.prototype.formatFloat = function(postfix?: string) {
    if (postfix == undefined) {
        postfix = ''
    }
    const v: number = Math.round(10 * Number(this)) / 10
    return `${v}${postfix}`
}

export class Helper {
    static temperatureString(c: CharacteristicType | undefined): string {
        if (c == undefined) {
            return '--.- °C'
        }

        return (+c.value).formatFloat(' °C')
    }

    static getCharacteristic(service: IHapService, type: string): CharacteristicType | undefined {
        return service.serviceCharacteristics.find(c => c.type == type)
    }
}
