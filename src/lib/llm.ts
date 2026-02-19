import Anthropic from "@anthropic-ai/sdk"

let clientInstance: Anthropic | null = null

function getClient(): Anthropic {
    if (!clientInstance) {
        clientInstance = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY || "dummy",
        })
    }
    return clientInstance
}

export const llm = {
    async generate(prompt: string, options: { model?: string; json?: boolean } = {}) {
        return this.generateWithSystem("", prompt, options)
    },

    async generateWithSystem(
        system: string,
        user: string,
        options: { model?: string; json?: boolean } = {}
    ): Promise<string> {
        if (!process.env.ANTHROPIC_API_KEY) {
            console.error("[LLM/Anthropic] ANTHROPIC_API_KEY is not configured")
            throw new Error("ANTHROPIC_API_KEY is not configured")
        }

        // Default to Haiku for speed; callers can override with claude-sonnet-4-6 for quality
        const model = options.model || "claude-haiku-4-5-20251001"
        const anthropic = getClient()

        try {
            const params: Anthropic.MessageCreateParamsNonStreaming = {
                model,
                max_tokens: 1024,
                messages: [{ role: "user", content: user }],
            }

            if (system) {
                params.system = system
            }

            if (options.json) {
                // Instruct Claude to respond with JSON only
                params.messages = [
                    { role: "user", content: `${user}\n\nRespond with valid JSON only. No markdown, no explanation.` }
                ]
            }

            const response = await anthropic.messages.create(params)
            const block = response.content[0]
            return block.type === "text" ? block.text.trim() : ""
        } catch (error) {
            console.error("[LLM/Anthropic] Generation error:", error)
            throw error
        }
    },
}
