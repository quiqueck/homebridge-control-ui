import Vue from 'vue'
import Vuex from 'vuex'
import InstanceModule from '@/store/InstanceModule'
import StateModule from '@/store/StateModule'
Vue.use(Vuex)
console.log(InstanceModule)
export default new Vuex.Store({
    modules: {
        InstanceModule,
        StateModule
    }
})
