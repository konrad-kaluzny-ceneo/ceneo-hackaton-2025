import { AttractionSearchService } from "@/features/rag";
import { callAI } from "@/infrastructure/AIService";
import { inject } from "@/infrastructure/DIContainer";
import { Repository } from "@/infrastructure/Repository";
import { TaskQueue } from "@/infrastructure/TaskQueue";
import { useUserId } from "@/infrastructure/UserAccessor";
import { NextRequest, NextResponse } from "next/server";

const repository = inject(Repository);

/**
 * POST /api/tasks/enqueue
 * Enqueues a long-running task
 * Body: { userId: string }
 */
export async function POST() {
  const taskQueue = inject(TaskQueue);
  const attractionSearchService = inject(AttractionSearchService);
  const userId = await useUserId();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const taskId = taskQueue.enqueue(async () => {
    const userContext = repository.getContextItems(userId);

    const attractionResult = await attractionSearchService.searchAttractions(
      userContext.filter(x => x.question == 'Description')?.[0]?.answer || ''
    );

    const aiGeneratedTrips = await callAI(
      `
      Generate a list of 3 trip propositions for a user in JSON format.
      Some data:
      ${JSON.stringify(userContext)}
      ${JSON.stringify(attractionResult)}
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

    let cleanedJson = aiGeneratedTrips.trim();
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.slice(7); // Remove ```json
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.slice(3); // Remove ```
    }
    if (cleanedJson.endsWith('```')) {
      cleanedJson = cleanedJson.slice(0, -3); // Remove trailing ```
    }
    cleanedJson = cleanedJson.trim();

    repository.addTripProposition({
      id: generateId(),
      userId: userId,
      taskId: taskId,
      data: JSON.parse(cleanedJson),
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
