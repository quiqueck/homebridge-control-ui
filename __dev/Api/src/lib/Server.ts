import express from 'express'

export interface IServerConfig {
    port: number
    baseURL: string
}

export class Server {
    readonly config: IServerConfig
    constructor(options: IServerConfig) {
        this.config = options
    }

    start(): void {
        console.log('ABC')
    }
}
