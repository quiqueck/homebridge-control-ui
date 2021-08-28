<script lang="ts">
import { CharacteristicType } from '@oznu/hap-client'
import { Component } from 'vue-property-decorator'
import SensorWidget from './SensorWidget.vue'

@Component({})
export default class AirQualitySensorWidget extends SensorWidget {
    humanReadable(c: CharacteristicType | undefined) {
        if (c == undefined) {
            return '-- ppm'
        }
        return `${c.value} ppm`
    }

    get kind() {
        return 'AirQuality'
    }
}
</script>

<style></style>
