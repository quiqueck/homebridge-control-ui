import { HapListener } from './lib/Listener'
import { LoggerConfig } from './lib/Logger'
import { APIServer } from './lib/APIServer'

const logger: LoggerConfig = {
    debug: true,
    log: function (a: any) {
        console.log('l', a)
    },
    warn: function (a: any) {
        console.log('w', a)
    },
}
const listener = new HapListener({
    pin: '178-12-920',
    //pin: '121-13-920',
    logger: logger,
    config: {
        debug: logger.debug,
    },
})

const server = new APIServer(listener, {
    port: 8099,
    frontendURL: 'http://localhost:8080',
    logger: logger,
})

server.start()
