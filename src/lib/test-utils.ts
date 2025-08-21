// Test utilities for integration testing
export class TestUtils {
  // Mock restaurant data for testing
  static createMockRestaurant(overrides: Partial<any> = {}) {
    return {
      id: "test-restaurant-1",
      name: "Test Restaurant",
      description: "A test restaurant for integration testing",
      apiKey: "test_api_key_123",
      context: "We are a test restaurant open 24/7 for testing purposes.",
      menuItems: [
        {
          id: "test-item-1",
          name: "Test Burger",
          description: "A delicious test burger",
          price: 1500,
          category: "Main Course",
          isAvailable: true,
        },
        {
          id: "test-item-2",
          name: "Test Salad",
          description: "A fresh test salad",
          price: 1000,
          category: "Salad",
          isAvailable: true,
        },
      ],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      ...overrides,
    }
  }

  // Mock WhatsApp message payload
  static createMockWhatsAppMessage(message: string, phoneNumber = "+221123456789") {
    return {
      entry: [
        {
          id: "test-entry-id",
          changes: [
            {
              field: "messages",
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "15550123456",
                  phone_number_id: "test-phone-number-id",
                },
                contacts: [
                  {
                    profile: {
                      name: "Test User",
                    },
                    wa_id: phoneNumber,
                  },
                ],
                messages: [
                  {
                    from: phoneNumber,
                    id: `test-message-${Date.now()}`,
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                    text: {
                      body: message,
                    },
                    type: "text",
                  },
                ],
              },
            },
          ],
        },
      ],
    }
  }

  // Test AI response generation
  static async testAIResponse(message: string, restaurant: any) {
    try {
      // This would normally call the actual AI client
      // For testing, we return a mock response
      return {
        response: `Test response for: ${message}`,
        detectedLanguage: "en",
        usedTools: [],
      }
    } catch (error) {
      throw new Error(`AI test failed: ${error}`)
    }
  }

  // Validate restaurant data structure
  static validateRestaurant(restaurant: any): boolean {
    const requiredFields = ["id", "name", "description", "apiKey", "context", "menuItems"]
    return requiredFields.every((field) => restaurant.hasOwnProperty(field))
  }

  // Validate menu item structure
  static validateMenuItem(item: any): boolean {
    const requiredFields = ["id", "name", "description", "price"]
    return requiredFields.every((field) => item.hasOwnProperty(field)) && typeof item.price === "number"
  }

  // Test webhook signature validation
  static testWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Mock implementation for testing
    return signature.includes("sha256=") && secret.length > 0
  }

  // Performance testing utilities
  static async measureResponseTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const start = performance.now()
    const result = await fn()
    const duration = performance.now() - start
    return { result, duration }
  }

  // Load testing simulation
  static async simulateLoad(
    fn: () => Promise<any>,
    concurrency = 10,
    iterations = 100,
  ): Promise<{
    totalTime: number
    averageTime: number
    successCount: number
    errorCount: number
  }> {
    const results: Array<{ success: boolean; duration: number }> = []
    const batches = Math.ceil(iterations / concurrency)

    for (let batch = 0; batch < batches; batch++) {
      const batchPromises = []
      const batchSize = Math.min(concurrency, iterations - batch * concurrency)

      for (let i = 0; i < batchSize; i++) {
        batchPromises.push(
          this.measureResponseTime(fn)
            .then((result) => ({ success: true, duration: result.duration }))
            .catch(() => ({ success: false, duration: 0 })),
        )
      }

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
    }

    const successCount = results.filter((r) => r.success).length
    const errorCount = results.length - successCount
    const totalTime = results.reduce((sum, r) => sum + r.duration, 0)
    const averageTime = totalTime / results.length

    return {
      totalTime,
      averageTime,
      successCount,
      errorCount,
    }
  }
}
