import { ServiceType } from '@oznu/hap-client'

export enum HapServiceType {
    Lightbulb = 'Lightbulb',
    LightSensor = 'LightSensor',
    HumiditySensor = 'HumiditySensor',
    Switch = 'Switch',
    ProtocolInformation = 'ProtocolInformation',
    StatelessProgrammableSwitch = 'StatelessProgrammableSwitch',
    Outlet = 'Outlet',
    ServiceLabel = 'ServiceLabel',
    TemperatureSensor = 'TemperatureSensor',
    AirQualitySensor = 'AirQualitySensor',
    Unknown = '?',

    //virtual Services for Displa
    vPM2_5Density = '___PM2_5Density',
    vPM10Density = '___PM10Density',
    vOn = '___On'
}

export interface HapSwitchServiceValues {
    On?: boolean
}

export interface HapSimpleLightServiceValues {
    Brightnes?: number
}

export interface HapColorLightServiceValues {
    Hue?: number
    ColorTemperature?: number
    Saturation?: number
}

export interface HapInputSourceValues {
    InputSourceType?: number
}

export interface HapInputAmbientLightValues {
    CurrentAmbientLightLevel?: number
}

export interface HapVolumeSourceValues {
    Volume?: number
    mute?: boolean
}

export interface HapRotationValues {
    RotationSpeed?: number
}

export interface HapServiceLabelIndexValues {
    ServiceLabelIndex?: number
}

export interface HapOutletInUseValues {
    OutletInUse?: boolean
}

export interface HapLightServiceValues extends HapSimpleLightServiceValues, HapColorLightServiceValues, HapSwitchServiceValues {}

export interface IHapServiceValues
    extends HapLightServiceValues,
        HapSwitchServiceValues,
        HapInputSourceValues,
        HapVolumeSourceValues,
        HapInputAmbientLightValues,
        HapRotationValues,
        HapServiceLabelIndexValues,
        HapOutletInUseValues {}

export interface IHapService extends ServiceType {
    values: IHapServiceValues
    type: HapServiceType
}
