<template>
    <div class="home">
        <Notifications></Notifications>
        <ServiceList msg="Welcome to Your Vue.js + TypeScript App" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ServiceList from '@/components/ServiceList.vue'
import Notifications from '@/components/Notifications.vue'

@Component({
    // eslint-disable-next-line no-undef
    components: {
        ServiceList,
        Notifications
    }
})
export default class Home extends Vue {}
</script>
