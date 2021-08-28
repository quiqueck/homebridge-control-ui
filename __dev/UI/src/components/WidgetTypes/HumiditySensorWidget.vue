<script lang="ts">
import { CharacteristicType } from '@oznu/hap-client'
import { Component } from 'vue-property-decorator'
import SensorWidget from './SensorWidget.vue'

@Component({})
export default class HumiditySensorWidget extends SensorWidget {
    humanReadable(c: CharacteristicType | undefined) {
        if (c == undefined) {
            return '--%'
        }
        return `${c.value}%`
    }

    get type() {
        return 'CurrentRelativeHumidity'
    }

    get kind() {
        return 'Humidity'
    }
}
</script>

<style></style>
