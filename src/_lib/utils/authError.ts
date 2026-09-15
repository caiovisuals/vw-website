export class AuthError extends Error {
    constructor(
        message: string,
        public statusCode: 401 | 403 = 401
    ) {
        super(message)
        this.name = "AuthError"
    }
}