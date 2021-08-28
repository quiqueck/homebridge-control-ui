<template>
    <ServiceWidget :service="service">
        <template v-slot:subtitle>
            <p>{{ kind }}</p>
        </template>
        <div class="text-h4 text-right">{{ value }}</div>
    </ServiceWidget>
</template>

<script lang="ts">
import { CharacteristicType } from '@oznu/hap-client'
import { Component, Prop } from 'vue-property-decorator'
import ServiceWidget from '@/components/ServiceWidget.vue'

@Component({})
export default class SensorWidget extends ServiceWidget {
    get value() {
        const c = this.getCharacteristic(this.type)
        return this.humanReadable(c)
    }

    get type(): string {
        return '-'
    }

    get kind(): string {
        return '-'
    }

    humanReadable(c: CharacteristicType | undefined) {
        if (c == undefined) {
            return '--'
        }
        return '' + c.value
    }
}
</script>

<style></style>
