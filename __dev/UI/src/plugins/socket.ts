import Vue from 'vue'
import VueSocketIOExt from 'vue-socket.io-extended'
import { io } from 'socket.io-client'
import store from '../store'
const socket = io('http://localhost:1234')

Vue.use(VueSocketIOExt, socket, store)
