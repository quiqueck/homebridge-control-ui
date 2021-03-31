import { HapListener, Server } from 'homebridge-controller-api-dev'

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
