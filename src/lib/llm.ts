import Groq from "groq-sdk";

let groqInstance: Groq | null = null;

function getGroqClient() {
    if (!groqInstance) {
        if (!process.env.GROQ_API_KEY) {
            console.error("[LLM/Groq] API KEY MISSING")
            // Don't throw here, let the call fail if needed, or throw if strictly required.
            // Throwing here might still crash if called too early, but at least controlled.
        }
        groqInstance = new Groq({
            apiKey: process.env.GROQ_API_KEY || "dummy", // Prevent crash on init if missing, but it will fail on request
        });
    }
    return groqInstance;
}

export const llm = {
    async generate(prompt: string, options: { model?: string, json?: boolean } = {}) {
        return this.generateWithSystem("", prompt, options)
    },

    async generateWithSystem(system: string, user: string, options: { model?: string, json?: boolean } = {}) {
        const model = options.model || "llama-3.3-70b-versatile"

        const groq = getGroqClient();

        if (!process.env.GROQ_API_KEY) {
            console.error("[LLM/Groq] API KEY MISSING at runtime")
            throw new Error("GROQ_API_KEY is not configured")
        }

        try {
            const messages: any[] = []
            if (system) messages.push({ role: "system", content: system })
            messages.push({ role: "user", content: user })

            const response = await groq.chat.completions.create({
                messages: messages,
                model: model,
                response_format: options.json ? { type: "json_object" } : undefined,
            });
            return response.choices[0]?.message?.content || "";
        } catch (error) {
            console.error("[LLM/Groq] Generation error:", error)
            throw error
        }
    }
};
