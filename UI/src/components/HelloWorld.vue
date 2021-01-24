<template>
    <v-container>
        <v-row class="text-center">
            <v-col cols="4" v-for="service in services" :key="service.uniqueID">
                <ServiceWidget :service="service"></ServiceWidget>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { IHapService } from '@/interfaces/IHapService'
import InstanceModule from '@/store/InstanceModule'
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import ServiceWidget from './ServiceWidget.vue'

@Component({
    components: { ServiceWidget }
})
export default class HelloWorld extends Vue {
    instance: InstanceModule | null = null

    constructor() {
        super()
    }

    mounted() {}

    get services(): IHapService[] {
        return this.instance ? this.instance.services : []
    }

    created() {
        this.instance = getModule(InstanceModule)
    }
}
</script>
