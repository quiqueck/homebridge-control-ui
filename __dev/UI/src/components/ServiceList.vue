<template>
    <v-container>
        <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</span>

        <v-row>
            <ServiceWidget v-for="service in serviceList" :key="service.uniqueID" :service="service"></ServiceWidget>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import store from '@/store'
import { IHapService } from '@/interfaces/IHapService'
import InstanceModule from '@/store/InstanceModule'
import { Socket } from 'vue-socket.io-extended'
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import ServiceWidget from './ServiceWidget.vue'

// eslint-disable-next-line no-undef
@Component({ components: { ServiceWidget } })
export default class ServiceList extends Vue {
    instance: InstanceModule | null = null
    constructor() {
        super()
    }

    @Prop({ default: null }) services: IHapService[] | null = null

    get serviceList(): IHapService[] {
        if (this.services === null) {
            return this.instance ? this.instance.services : []
        } else {
            return this.services
        }
    }

    mounted() {}
    created() {
        this.instance = getModule(InstanceModule, store)
    }
}
</script>

<style></style>
