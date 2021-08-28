<template>
    <ServiceWidget :service="service" width="2">
        <template v-slot:subtitle>
            <p>HelloLight</p>
        </template>
    </ServiceWidget>
</template>

<script lang="ts">
import { IHapService } from '@/interfaces/IHapService'
import { CharacteristicType } from '@oznu/hap-client'
import { Component, Prop, Vue } from 'vue-property-decorator'
import ServiceWidget from '@/components/ServiceWidget.vue'

@Component({})
export default class LightBulbWidget extends ServiceWidget {}
</script>

<style></style>
