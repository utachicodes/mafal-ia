// Centralized logging utility

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

const currentLogLevel: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug'

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel]
}

export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...args)
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args)
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  },
  
  error: (message: string, error?: Error, ...args: any[]) => {
    if (shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error || '', ...args)
    }
  },
  
  // For API responses and other structured logging
  api: {
    request: (endpoint: string, method: string, data?: any) => {
      if (shouldLog('debug')) {
        console.debug(`[API] ${method} ${endpoint}`, data || '')
      }
    },
    
    response: (endpoint: string, method: string, status: number, data?: any) => {
      if (shouldLog('debug')) {
        console.debug(`[API] ${method} ${endpoint} ${status}`, data || '')
      }
    },
    
    error: (endpoint: string, method: string, status: number, error?: any) => {
      console.error(`[API] ${method} ${endpoint} ${status}`, error || '')
    }
  }
}

export default logger
