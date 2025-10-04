import OpenAI from "openai";

const client = new OpenAI();

export async function callOpenAIApi(prompt: string) {
  const response = await client.responses.create({
    model: "gpt-4o",
    input: prompt,
  });
  return response.output_text;
}
