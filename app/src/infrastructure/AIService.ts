import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";


const CACHE_FILE_PATH = path.join(process.cwd(), "src", "local-data", "ai-cache.txt");

export async function callAI(prompt: string) {
    const client = new OpenAI();

    const response = await client.responses.create({
        model: "gpt-4o",
        input: prompt,
    });
    console.log(response.output_text);
    return response.output_text;
}
