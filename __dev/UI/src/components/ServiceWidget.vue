<template>
    <BaseServiceWidget :service="service" :width="width">
        <v-list-item two-line>
            <v-list-item-content>
                <v-list-item-title class="headline">
                    <slot name="title">{{ service.serviceName }}</slot>
                </v-list-item-title>
                <v-list-item-subtitle>
                    <slot name="subtitle">{{ service.type }}</slot>
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-card-text>
            <slot>
                <div v-for="ch in service.serviceCharacteristics" :key="ch.uuid">
                    <b>{{ ch.type }}</b> = {{ ch.value }} : {{ ch.format }} [{{ ch.minValue }}, {{ ch.maxValue }}]
                </div>
            </slot>
        </v-card-text>
    </BaseServiceWidget>
</template>

<script lang="ts">
import { IHapService } from '@/interfaces/IHapService'
import { CharacteristicType } from '@oznu/hap-client'
import { Component, Prop, Vue } from 'vue-property-decorator'
import BaseServiceWidget from './BaseServiceWidget.vue'

@Component({})
export default class ServiceWidget extends BaseServiceWidget {}
</script>
