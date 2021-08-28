<script lang="ts">
import { CharacteristicType } from '@oznu/hap-client'
import { Component } from 'vue-property-decorator'
import { Helper } from '@/lib/helper'
import SensorWidget from './SensorWidget.vue'

@Component({})
export default class TemperatureSensorWidget extends SensorWidget {
    humanReadable(c: CharacteristicType | undefined) {
        return Helper.temperatureString(c)
    }

    get type() {
        return 'CurrentTemperature'
    }

    get kind() {
        return 'Temperature'
    }
}
</script>

<style></style>
