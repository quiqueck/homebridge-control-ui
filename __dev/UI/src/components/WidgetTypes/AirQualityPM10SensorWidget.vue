<script lang="ts">
import { Component } from 'vue-property-decorator'
import AirQualitySensorWidget from './AirQualitySensorWidget.vue'

@Component({})
export default class AirQualityPM10SensorWidget extends AirQualitySensorWidget {
    get type() {
        return 'PM10Density'
    }
    get kind() {
        return 'AirQuality (10 nm)'
    }
}
</script>
