import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const llm = {
    async generate(prompt: string, options: { model?: string, json?: boolean } = {}) {
        const response = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: options.model || "llama-3.3-70b-versatile",
            response_format: options.json ? { type: "json_object" } : undefined,
        });
        return response.choices[0]?.message?.content || "";
    }
};
