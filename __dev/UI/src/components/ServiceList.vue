<template>
    <v-container>
        <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</span>

        <v-row>
            <div v-for="service in serviceList" :key="service.uniqueID">
                <Component v-bind:is="componentForService(service)" :service="service"></Component>
            </div>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import store from '@/store'
import { HapServiceType, IHapService } from '@/interfaces/IHapService'
import InstanceModule from '@/store/InstanceModule'
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import ServiceWidget from './ServiceWidget.vue'
import SwitchWidget from './WidgetTypes/SwitchWidget.vue'
import LightBulbWidget from './WidgetTypes/LightBulbWidget.vue'
import OutletWidget from './WidgetTypes/OutletWidget.vue'
import TemperatureSensorWidget from './WidgetTypes/TemperatureSensorWidget.vue'
import LightSensorWidget from './WidgetTypes/LightSensorWidget.vue'
import HumiditySensorWidget from './WidgetTypes/HumiditySensorWidget.vue'
import { Helper } from '@/lib/helper'
import { serviceMapping, VirtualService } from '@/lib/VirtualService'
import AirQualitySensorWidget from './WidgetTypes/AirQualitySensorWidget.vue'
import AirQualityPM2_5SensorWidget from './WidgetTypes/AirQualityPM2_5SensorWidget.vue'
import AirQualityPM10SensorWidget from './WidgetTypes/AirQualityPM10SensorWidget.vue'

// eslint-disable-next-line no-undef
@Component({ components: { ServiceWidget, SwitchWidget, LightBulbWidget } })
export default class ServiceList extends Vue {
    instance: InstanceModule | null = null
    constructor() {
        super()
    }

    @Prop({ default: null }) services: IHapService[] | null = null

    getActualServiceList(): IHapService[] {
        if (this.services === null) {
            return this.instance ? this.instance.services : []
        } else {
            return this.services
        }
    }

    get serviceList(): IHapService[] {
        return this.getActualServiceList()
            .map((service: IHapService) => {
                const custom = service.serviceCharacteristics.filter(c => serviceMapping.has(c.type))
                if (custom.length > 0) {
                    const res: IHapService[] = []
                    const remainging = service.serviceCharacteristics.filter(c => custom.indexOf(c) < 0 && !VirtualService.isDependencyOf(c.type, custom))
                    if (remainging.length > 0) {
                        res.push(new VirtualService(service.type, service))
                    }
                    custom.forEach(c => res.push(new VirtualService(serviceMapping.get(c.type), service)))
                    return res
                }

                return [service]
            })
            .flat(1)
    }

    componentForService(service: IHapService): any {
        if (service.type == HapServiceType.Switch) {
            return SwitchWidget
        } else if (service.type == HapServiceType.Lightbulb) {
            return LightBulbWidget
        } else if (service.type == HapServiceType.Outlet) {
            return OutletWidget
        } else if (service.type == HapServiceType.TemperatureSensor) {
            return TemperatureSensorWidget
        } else if (service.type == HapServiceType.LightSensor) {
            return LightSensorWidget
        } else if (service.type == HapServiceType.HumiditySensor) {
            return HumiditySensorWidget
        } else if (service.type == HapServiceType.vPM2_5Density) {
            return AirQualityPM2_5SensorWidget
        } else if (service.type == HapServiceType.vPM10Density) {
            return AirQualityPM10SensorWidget
        }
        return ServiceWidget
    }

    mounted() {}
    created() {
        this.instance = getModule(InstanceModule, store)
    }
}
</script>

<style></style>
