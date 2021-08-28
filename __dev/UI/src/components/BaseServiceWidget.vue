<template>
    <div :class="`${containerClass} ma-2 pa-0`">
        <v-card class="serviceWidget">
            <slot>
                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title class="headline">
                            {{ service.serviceName }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{ service.type }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </slot>
        </v-card>
    </div>
</template>

<script lang="ts">
import { IHapService } from '@/interfaces/IHapService'
import { Helper } from '@/lib/helper'
import { CharacteristicType } from '@oznu/hap-client'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class BaseServiceWidget extends Vue {
    constructor() {
        super()
    }

    @Prop({ required: true }) readonly service!: IHapService
    @Prop({ required: false, default: 1 }) readonly width!: number

    getCharacteristic(type: string): CharacteristicType | undefined {
        console.log(type, this.service.serviceCharacteristics)
        return Helper.getCharacteristic(this.service, type)
    }

    get containerClass() {
        if (this.width == 2) {
            return 'container-2'
        }
        return 'container'
    }

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
.container-2
    width: 416px
.serviceWidget
    height: auto
    min-height: 92px
</style>
