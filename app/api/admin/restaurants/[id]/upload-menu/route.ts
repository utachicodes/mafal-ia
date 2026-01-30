import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ai } from "@/lib/genkit";
import { gemini15Flash } from "@genkit-ai/googleai";
import pdf from "pdf-parse";
import { z } from "zod";

const MenuItemSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    category: z.string().optional(),
});

const MenuItemsSchema = z.object({
    items: z.array(MenuItemSchema),
});

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let extractedText = "";

        // Extract text based on file type
        if (file.type === "application/pdf") {
            // PDF extraction
            const pdfData = await pdf(buffer);
            extractedText = pdfData.text;
        } else if (file.type.startsWith("image/")) {
            // Image OCR using Gemini Vision
            const base64Image = buffer.toString("base64");
            const mimeType = file.type;

            const { text } = await ai.generate({
                model: gemini15Flash,
                prompt: `Extract all menu items from this image. Look for dish names, descriptions, and prices. 
        Return the information in a structured format that can be parsed.
        If you see prices, include the currency symbol or note FCFA if in West Africa context.`,
                config: {
                    temperature: 0.1,
                },
                media: {
                    url: `data:${mimeType};base64,${base64Image}`,
                    contentType: mimeType,
                },
            });

            extractedText = text;
        } else {
            return NextResponse.json(
                { error: "Unsupported file type. Use PDF or image files." },
                { status: 400 }
            );
        }

        // Parse extracted text with AI
        const { output } = await ai.generate({
            model: gemini15Flash,
            prompt: `You are a menu parser. Extract menu items from the following text.
      
For each item, extract:
- name: The dish name
- description: A brief description (if available, otherwise use the name)
- price: The price as a number (remove currency symbols, convert to integer)
- category: The category/section (Entrées, Plats, Desserts, Boissons, etc.)

Text to parse:
${extractedText}

Return a JSON object with an "items" array containing the extracted menu items.
If no clear menu items are found, return an empty items array.`,
            config: {
                temperature: 0.2,
            },
            output: {
                schema: MenuItemsSchema,
            },
        });

        return NextResponse.json({
            items: output.items || [],
            rawText: extractedText, // For debugging
        });
    } catch (error: any) {
        console.error("Menu upload error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process menu" },
            { status: 500 }
        );
    }
}
