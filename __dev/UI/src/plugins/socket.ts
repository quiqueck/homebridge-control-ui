import Vue from 'vue'
import VueSocketIOExt from 'vue-socket.io-extended'
import { io } from 'socket.io-client'
import store from '../store'
const socket = io('http://localhost:8099', {
    auth: {
        token: 'ga0kah2cah4ohX5ufaeK5ipoodeiR2ei'
    }
})

Vue.use(VueSocketIOExt, socket, store)
