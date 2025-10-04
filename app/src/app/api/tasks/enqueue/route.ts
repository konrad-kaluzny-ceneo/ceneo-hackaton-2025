import { callAI } from "@/infrastructure/AIService";
import { inject } from "@/infrastructure/DIContainer";
import { Repository } from "@/infrastructure/Repository";
import { TaskQueue } from "@/infrastructure/TaskQueue";
import { useUserId } from "@/infrastructure/UserAccessor";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';

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
    const locationsRaw = fs.readFileSync('./src/local-data/locations.json', 'utf-8');
    const transportRaw = fs.readFileSync('./src/local-data/transport.json', 'utf-8');
    const accommodationRaw = fs.readFileSync('./src/local-data/accomodation.json', 'utf-8');

    // Limit each list to max 20 elements
    const locations = JSON.stringify(JSON.parse(locationsRaw).slice(0, 20));
    const transport = JSON.stringify(JSON.parse(transportRaw).slice(0, 20));
    const accommodation = JSON.stringify(JSON.parse(accommodationRaw).slice(0, 20));

    const aiGeneratedTrips = await callAI(
      `
      Generate a list of 3 trip propositions for a user in JSON format.
      Some data:
      ${locations}
      ${transport}
      ${accommodation}
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
