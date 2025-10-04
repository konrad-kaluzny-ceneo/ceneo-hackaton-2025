import { callAI } from "@/infrastructure/AIService";
import { inject } from "@/infrastructure/DIContainer";
import { Repository } from "@/infrastructure/Repository";
import { TaskQueue } from "@/infrastructure/TaskQueue";
import { useUserId } from "@/infrastructure/UserAccessor";
import { RAGService } from "@/infrastructure/RAGService";
import { NextRequest, NextResponse } from "next/server";

const repository = inject(Repository);

/**
 * POST /api/tasks/enqueue
 * Enqueues a long-running task
 * Body: { userId: string }
 */
export async function POST(request: NextRequest) {
  const taskQueue = inject(TaskQueue);
  const userId = useUserId(request);

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const taskId = taskQueue.enqueue(async () => {
    // Pobierz kontekst użytkownika z kwestionariusza
    const userContext = repository.getContextItems(userId);
    
    // Użyj RAG z embeddingami do pobrania semantycznie relevantnych danych
    const ragService = inject(RAGService);
    const relevantData = await ragService.getRelevantData(userContext, 20);
    const formattedData = ragService.formatForAI(relevantData);

    // Stwórz kontekst użytkownika dla AI
    const userContextSummary = userContext
      .map(item => `Q: ${item.question}\nA: ${item.answer}`)
      .join('\n\n');

    const aiGeneratedTrips = await callAI(
      `
      Generate a list of 3 trip propositions for a user in JSON format.
      
      USER PREFERENCES (from questionnaire):
      ${userContextSummary}
      
      AVAILABLE DATA (filtered based on user preferences):
      
      Locations:
      ${formattedData.locations}
      
      Transport:
      ${formattedData.transport}
      
      Accommodation:
      ${formattedData.accommodation}
      
      IMPORTANT:
      - Create trips that match the user's preferences from the questionnaire
      - Use only the locations, transport, and accommodation provided above
      - Ensure prices are realistic and match the data provided
      - Consider the user's budget, activity level, and other preferences
      
      Ensure the JSON is properly formatted.
      Example:
      [
          {
              "id": "trip-1",
              "name": "Przygoda po Europie Środkowej",
              "totalPrice": 659.49,
              "duration": 7,
              "destinations": [
              {
                  "order": 1,
                  "transport": {
                  "from": {
                      "country": "Polska",
                      "region": "Dolnośląskie",
                      "city": "Wrocław"
                  },
                  "fromDate": "2025-10-10",
                  "destination": {
                      "country": "Niemcy",
                      "region": "Berlin",
                      "city": "Berlin"
                  },
                  "destinationDate": "2025-10-10",
                  "price": 89.99,
                  "name": "Autobus FlixBus"
                  },
                  "accommodation": null
              }
          }
      ]
      RETURN ONLY JSON WITHOUT ANY ADDITIONAL TEXT. DO NOT ADD \`\`\`json
      `);

    repository.addTripProposition({
      id: generateId(),
      userId: userId,
      taskId: taskId,
      data: JSON.parse(aiGeneratedTrips),
      createdAt: new Date(),
    });

    return {
      message: "Task completed successfully!",
      completedAt: new Date().toISOString(),
      data: aiGeneratedTrips,
    };
  });

  return NextResponse.json({
    success: true,
    taskId,
  });
}
function generateId(): string {
  return crypto.randomUUID();
}
