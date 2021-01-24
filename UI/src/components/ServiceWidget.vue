<template>
    <v-card>
        <v-list-item two-line>
            <v-list-item-content>
                <v-list-item-title class="headline">
                    {{ service.serviceName }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ service.type }}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-card-text>
            <div v-for="ch in service.serviceCharacteristics" :key="ch.uuid">
                <b>{{ ch.type }}</b> = {{ ch.value }} : {{ ch.format }} [{{ ch.minValue }}, {{ ch.maxValue }}]
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { IHapService } from '@/interfaces/IHapService'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class ServiceWidget extends Vue {
    constructor() {
        super()
    }

    @Prop({ required: true }) readonly service!: IHapService

    mounted() {}
}
</script>
