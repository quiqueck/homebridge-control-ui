<script lang="ts">
import { CharacteristicType } from '@oznu/hap-client'
import { Component } from 'vue-property-decorator'
import SensorWidget from './SensorWidget.vue'

@Component({})
export default class LightSensorWidget extends SensorWidget {
    humanReadable(c: CharacteristicType | undefined) {
        if (c == undefined) {
            return '--'
        }
        return `${c.value} LUX`
    }

    get type() {
        return 'CurrentAmbientLightLevel'
    }

    get kind() {
        return 'Lightlevel'
    }
}
</script>

<style></style>
