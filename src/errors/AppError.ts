class AppError {
    constructor (
        private message: string,
        private statusCode = 400,
    ) {}
}

export { AppError };