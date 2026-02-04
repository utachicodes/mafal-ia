import { genkit } from "genkit";

export const ai = genkit({
    plugins: [], // AI flows now use custom Groq-backed provider helper
});
