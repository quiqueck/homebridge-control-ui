import { HapListener } from './lib/Listener'
import { Server } from './lib/Server'

const server = new Server({
    port: 8099,
    baseURL: '',
})
server.start()

const listener = new HapListener({
    pin: '178-12-920',
    //pin: '121-13-920',
    logger: {
        log: function (a: any) {
            console.log('l', a)
        },
        warn: function (a: any) {
            console.log('w', a)
        },
    },
    config: { debug: true },
})
listener.start()

const io = require('socket.io')(1234, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
})
io.emit('tweet', {})
