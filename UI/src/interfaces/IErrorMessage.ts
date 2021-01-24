export interface ErrorMessage {
    message: string
    details: string
    sender: string
    data: any
    rethrow?: boolean
}
