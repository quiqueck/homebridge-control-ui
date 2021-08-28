const njodb = require('njodb')

export interface User {
    uname: string
    displayname: string
    isAdmin: boolean
    salt: string
    hash: string
}

export interface SessionToke {
    login: string
    token: string
    expire?: Date
}

export interface InsertResult {
    store: string
    inserted: number
    start: Date
    end: Date
    elapsed: number
    details?: any[]
}

export class Storage {
    private _db: any | undefined
    constructor(private readonly path: string) {}

    get db(): any {
        if (this._db === undefined) {
            this._db = new njodb.Database(this.path)
        }
        return this._db
    }

    addUser(u: User) {
        this.db.insert([u]).then((results: InsertResult) => {
            console.log(results)
        })
    }
}
