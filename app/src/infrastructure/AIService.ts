import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";


const CACHE_FILE_PATH = path.join(process.cwd(), "src", "local-data", "ai-cache.txt");

export async function callAI(prompt: string) {
    try {
        const cacheContent = await fs.readFile(CACHE_FILE_PATH, "utf-8");
        if (cacheContent.trim().length > 0) {
            console.log("Using cached AI response");
            return cacheContent;
        }
    } catch (error) {
        console.log("Cache file not found or empty, calling OpenAI API");
    }

    const client = new OpenAI();

    const response = await client.responses.create({
        model: "gpt-4o",
        input: prompt,
    });
    return response.output_text;
}
