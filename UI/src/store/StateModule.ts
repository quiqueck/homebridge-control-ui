import { VuexModule, Module, Mutation } from 'vuex-module-decorators'
import store from '@/store/'
import { ErrorMessage } from '@/interfaces/IErrorMessage'

@Module({ store, name: 'StateModule', dynamic: true })
export default class StateModule extends VuexModule {
    connected: boolean = false
    error: ErrorMessage | null = null

    get hasError(): boolean {
        return this.error !== null && this.error !== undefined
    }

    @Mutation
    setConnected(ok: boolean) {
        this.connected = ok
    }

    @Mutation
    addError(err: ErrorMessage) {
        this.error = err
    }
}
