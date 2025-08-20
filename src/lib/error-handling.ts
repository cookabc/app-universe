// Enhanced error handling for the application

export class AppError extends Error {
    constructor(
        message: string,
        public code: string = 'UNKNOWN_ERROR',
        public statusCode: number = 500,
        public details?: any,
    ) {
        super(message)
        this.name = 'AppError'
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 'VALIDATION_ERROR', 400, details)
        this.name = 'ValidationError'
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 'AUTHENTICATION_ERROR', 401)
        this.name = 'AuthenticationError'
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Insufficient permissions') {
        super(message, 'AUTHORIZATION_ERROR', 403)
        this.name = 'AuthorizationError'
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 'NOT_FOUND_ERROR', 404)
        this.name = 'NotFoundError'
    }
}

export class NetworkError extends AppError {
    constructor(message: string = 'Network request failed') {
        super(message, 'NETWORK_ERROR', 502)
        this.name = 'NetworkError'
    }
}

// Error handler utility functions
export function handleError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error
    }

    if (error instanceof Error) {
        // Handle specific error types
        if (error.message.includes('Authentication') || error.message.includes('Unauthorized')) {
            return new AuthenticationError(error.message)
        }

        if (error.message.includes('Permission') || error.message.includes('Forbidden')) {
            return new AuthorizationError(error.message)
        }

        if (error.message.includes('not found')) {
            return new NotFoundError(error.message)
        }

        if (error.message.includes('Network') || error.message.includes('fetch')) {
            return new NetworkError(error.message)
        }

        return new AppError(error.message, 'UNKNOWN_ERROR', 500, error)
    }

    // Handle non-Error objects
    return new AppError(typeof error === 'string' ? error : 'An unknown error occurred', 'UNKNOWN_ERROR', 500, error)
}

export function logError(error: unknown, context?: string): void {
    const appError = handleError(error)

    console.error(`[${context || 'APP'}] ${appError.code}: ${appError.message}`, {
        error: appError,
        stack: appError.stack,
        details: appError.details,
        timestamp: new Date().toISOString(),
    })
}

export function createErrorHandler(context: string) {
    return (error: unknown) => {
        logError(error, context)
        return handleError(error)
    }
}

// Type guard for error handling
export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError
}

// Response formatting for API routes
export function formatErrorResponse(error: unknown) {
    const appError = handleError(error)

    return {
        success: false,
        error: {
            message: appError.message,
            code: appError.code,
            statusCode: appError.statusCode,
            ...(appError.details && { details: appError.details }),
        },
    }
}

// Async error wrapper for try-catch patterns
export async function safeAsync<T>(
    fn: () => Promise<T>,
    context?: string,
): Promise<{ success: true; data: T } | { success: false; error: AppError }> {
    try {
        const data = await fn()
        return { success: true, data }
    } catch (error) {
        const appError = handleError(error)
        logError(appError, context)
        return { success: false, error: appError }
    }
}
