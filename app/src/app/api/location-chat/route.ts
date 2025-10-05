import { NextRequest } from "next/server";
import OpenAI from "openai";
import userSets from "@/local-data/sample-sets.json";
import locations from "@/local-data/locations.json";

const activeTrips = userSets.filter(set => set.state === "active");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { locationId, message, conversationHistory } = await req.json();

  const location = locations.find((loc: any) => loc.id === locationId);
  const userActiveTrips = activeTrips.filter((trip: any) =>
    trip.destinations.some((dest: any) => {
      const destLocation = dest.accommodation?.location || dest.transport?.destination;
      return destLocation?.city === location?.location.city;
    })
  );

  const systemPrompt = `Jesteś pomocnym asystentem AI specjalizującym się w planowaniu podróży. 
Pomagasz użytkownikom w wyborze najlepszych wycieczek i udzielasz im porad dotyczących lokalizacji.

Kontekst:
- Lokalizacja: ${location?.location.city}, ${location?.location.region}, ${location?.location.country}
- Atrakcje: ${location?.attractions.map((a: any) => `${a.name} - ${a.description}`).join("; ")}
- Aktywne wycieczki użytkownika w tej lokalizacji: ${userActiveTrips.length > 0 ? userActiveTrips.map((t: any) => t.name).join(", ") : "Brak"}

Odpowiadaj w sposób przyjazny, konkretny i pomocny. Skup się na doradztwie w zakresie podróży i lokalizacji.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...(conversationHistory || []),
    { role: "user", content: message },
  ];

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as any,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(`0:"${text}"\n`));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error in location chat:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
