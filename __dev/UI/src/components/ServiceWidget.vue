<template>
    <div class="container ma-2 pa-0">
        <v-card class="serviceWidget">
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
    </div>
</template>

<script lang="ts">
import { IHapService } from '@/interfaces/IHapService'
import { CharacteristicType } from '@oznu/hap-client'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class ServiceWidget extends Vue {
    constructor() {
        super()
    }

    @Prop({ required: true }) readonly service!: IHapService

    mounted() {
        this.$socket.$subscribe('event_name', (data: CharacteristicType) => {
            console.log(data)
        })
    }

    destroyed() {
        this.$socket.$unsubscribe('event_name')
    }
}
</script>

<style lang="stylus" scoped>
.container
    width: 200px
.serviceWidget
    height: auto
    min-height: 200px
</style>
