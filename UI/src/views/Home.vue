<template>
    <div class="home">
        <ServiceList msg="Welcome to Your Vue.js + TypeScript App" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ServiceList from '@/components/ServiceList.vue' // @ is an alias to /src

@Component({
    components: {
        ServiceList
    }
})
export default class Home extends Vue {}
</script>
