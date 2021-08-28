<script lang="ts">
import { Component } from 'vue-property-decorator'
import AirQualitySensorWidget from './AirQualitySensorWidget.vue'

@Component({})
export default class AirQualityPM2_5SensorWidget extends AirQualitySensorWidget {
    get type() {
        return 'PM2_5Density'
    }
    get kind() {
        return 'AirQuality (2.5 nm)'
    }
}
</script>
