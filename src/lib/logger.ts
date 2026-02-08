import { PrismaClient } from "@prisma/client"
import { getPrisma } from "@/src/lib/db"

export type LogLevel = "INFO" | "WARN" | "ERROR"

class Logger {
  private prisma: PrismaClient | null = null

  private async getClient() {
    if (!this.prisma) {
      this.prisma = await getPrisma()
    }
    return this.prisma
  }

  private async log(level: LogLevel, message: string, metadata?: any, source: string = "APP") {
    // Console fallback for dev/debugging
    const timestamp = new Date().toISOString()
    const metaString = metadata ? JSON.stringify(metadata) : ""

    if (level === "ERROR") {
      console.error(`[${timestamp}] [${level}] [${source}] ${message}`, metadata || "")
    } else if (level === "WARN") {
      console.warn(`[${timestamp}] [${level}] [${source}] ${message}`, metadata || "")
    } else {
      console.log(`[${timestamp}] [${level}] [${source}] ${message}`, metadata || "")
    }

    try {
      const prisma = await this.getClient()
      // Fire-and-forget to avoid blocking the main thread
      // We don't await this promise
      if (prisma) {
        (prisma as any).systemLog.create({
          data: {
            level,
            message,
            metadata: metadata ? (metadata as any) : undefined,
            source,
            timestamp: new Date()
          }
        }).catch((err: any) => {
          console.error("Failed to write log to database:", err)
        })
      }
    } catch (error) {
      console.error("Failed to acquire prisma client for logging:", error)
    }
  }

  info(message: string, metadata?: any, source?: string) {
    this.log("INFO", message, metadata, source)
  }

  warn(message: string, metadata?: any, source?: string) {
    this.log("WARN", message, metadata, source)
  }

  error(message: string, error?: any, source?: string) {
    const errorMeta = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error

    this.log("ERROR", message, errorMeta, source)
  }
}

export const logger = new Logger()
