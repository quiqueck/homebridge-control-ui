<template>
    <div class="pa-3">
        <v-alert border="top" color="red lighten-2" dark type="error" v-show="hasError">
            {{ errorMessage }}<br /><span class="caption lighter">{{ errorDetails }}</span>
        </v-alert>
    </div>
</template>

<script lang="ts">
import StateModule from '@/store/StateModule'
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

@Component({})
export default class Notifications extends Vue {
    constructor() {
        super()
    }

    mounted() {}

    get errorMessage(): string {
        return this.state && this.state.error ? this.state.error.message : ''
    }

    get errorDetails(): string {
        return this.state && this.state.error ? this.state.error.details : ''
    }

    get hasError(): boolean {
        return this.state ? this.state.hasError : false
    }

    state: StateModule | null = null

    created() {
        this.state = getModule(StateModule)
    }
}
</script>

<style lang="stylus" scoped>
.lighter
    opacity: 0.5
</style>
