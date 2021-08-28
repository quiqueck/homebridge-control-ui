import { Storage } from './lib/Storage'
import { HapListener } from './lib/Listener'
import { LoggerConfig } from './lib/Logger'
import { APIServer } from './lib/APIServer'
import axios from 'axios'

const store = new Storage(process.cwd())
store.addUser({
    uname: 'sifrbaue',
    displayname: 'Frank Bauer',
    isAdmin: true,
    salt: 'lkjsadahfue',
    hash: '####',
})

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
// axios
//     .get('http://192.168.55.21:58251/accessories')
//     .then((response) => {
//         console.log(response)
//     })
//     .catch((e) => {
//         console.log('Error: ', e.message)
//     })
