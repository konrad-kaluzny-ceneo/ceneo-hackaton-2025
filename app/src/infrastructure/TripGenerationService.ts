import { db } from "@/db";
import { AttractionSearchService } from "@/features/rag";
import { callAI } from "./AIService";
import { inject } from "./DIContainer";
import { Repository } from "./Repository";

export class TripGenerationService {
  async generateTripsForUser(userId: string, taskId: string): Promise<any> {
    const repository = inject(Repository);
    const attractionSearchService = inject(AttractionSearchService);

    const userContext = repository.getContextItems(userId);

    const attractionResult = await attractionSearchService.searchAttractions(
      userContext.filter(x => x.question == 'Summary')?.[0]?.answer || ''
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
      cleanedJson = cleanedJson.slice(7);
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.slice(3);
    }
    if (cleanedJson.endsWith('```')) {
      cleanedJson = cleanedJson.slice(0, -3);
    }
    cleanedJson = cleanedJson.trim();

    const tripData = JSON.parse(cleanedJson);

    await db.tripProposition.create({
      data: {
        userId,
        taskId,
        data: JSON.stringify(tripData),
      },
    });

    repository.addTripProposition({
      id: crypto.randomUUID(),
      userId,
      taskId,
      data: tripData,
      createdAt: new Date(),
    });

    return {
      message: "Trip generation completed successfully",
      completedAt: new Date().toISOString(),
      data: tripData,
    };
  }

  async getTripPropositionsByUserId(userId: string) {
    const propositions = await db.tripProposition.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return propositions.map(p => ({
      ...p,
      data: JSON.parse(p.data),
    }));
  }

  async getTripPropositionByTaskId(taskId: string) {
    const proposition = await db.tripProposition.findFirst({
      where: { taskId },
    });

    if (!proposition) return null;

    return {
      ...proposition,
      data: JSON.parse(proposition.data),
    };
  }
}
