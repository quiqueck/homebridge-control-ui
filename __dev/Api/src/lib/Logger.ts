export interface LoggerConfig {
    debug: boolean
    log: (text: string) => void
    warn: (text: string) => void
}

export class Logger {
    private readonly loggerConfig: LoggerConfig
    private readonly defaultName: string
    constructor(options: LoggerConfig, defaultName: string) {
        this.loggerConfig = options
        this.defaultName = defaultName
    }

    protected l(whoOrtext: String, text?: String) {
        if (text === undefined) {
            text = whoOrtext
            whoOrtext = this.defaultName
        }
        this.loggerConfig.log(`[${whoOrtext}] ${text}`)
    }

    protected w(whoOrtext: String, text?: String) {
        if (text === undefined) {
            text = whoOrtext
            whoOrtext = this.defaultName
        }
        this.loggerConfig.warn(`[${whoOrtext}] ${text}`)
    }

    protected dl(whoOrtext: String, text?: String) {
        if (text === undefined) {
            text = whoOrtext
            whoOrtext = this.defaultName
        }
        if (this.loggerConfig.debug) {
            this.loggerConfig.log(`[DEBUG ${whoOrtext}] ${text}`)
        }
    }
}
