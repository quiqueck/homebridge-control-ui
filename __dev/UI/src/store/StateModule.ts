import { VuexModule, Module, Mutation } from 'vuex-module-decorators'
import { ErrorMessage } from '@/interfaces/IErrorMessage'

@Module({ name: 'StateModule' })
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
