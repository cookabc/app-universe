type LogLevel = 'debug' | 'info' | 'warn' | 'error'

class Logger {
    private get isProduction(): boolean {
        return process.env.NODE_ENV === 'production'
    }

    private shouldLog(level: LogLevel): boolean {
        if (this.isProduction && level === 'debug') return false
        return true
    }

    debug(message: string, ...args: unknown[]) {
        if (this.shouldLog('debug')) {
            // eslint-disable-next-line no-console
            console.debug(`[DEBUG] ${message}`, ...args)
        }
    }

    info(message: string, ...args: unknown[]) {
        if (this.shouldLog('info')) {
            // eslint-disable-next-line no-console
            console.info(`[INFO] ${message}`, ...args)
        }
    }

    warn(message: string, ...args: unknown[]) {
        if (this.shouldLog('warn')) {
            // eslint-disable-next-line no-console
            console.warn(`[WARN] ${message}`, ...args)
        }
    }

    error(message: string, ...args: unknown[]) {
        if (this.shouldLog('error')) {
            // eslint-disable-next-line no-console
            console.error(`[ERROR] ${message}`, ...args)
        }
    }
}

export const logger = new Logger()
