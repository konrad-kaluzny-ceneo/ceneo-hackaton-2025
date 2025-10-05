import { db } from "@/db";
import { inject } from "@/infrastructure/DIContainer";
import { TaskQueue } from "@/infrastructure/TaskQueue";
import { TripGenerationService } from "@/infrastructure/TripGenerationService";
import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-vercel-signature");
    
    if (WEBHOOK_SECRET && signature !== WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await request.json();

    const webhookEvent = await db.webhookEvent.create({
      data: {
        source: "vercel",
        eventType: payload.type || "trip_generation",
        payload: JSON.stringify(payload),
        processed: false,
      },
    });

    const userId = payload.userId;
    const webhookTaskId = payload.taskId;

    if (!userId) {
      await db.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processed: true,
          error: "userId is required in payload",
          processedAt: new Date(),
        },
      });

      return NextResponse.json(
        { error: "userId is required in payload" },
        { status: 400 }
      );
    }

    const taskQueue = inject(TaskQueue);
    const tripGenerationService = inject(TripGenerationService);

    const taskId = taskQueue.enqueue(
      async () => {
        try {
          const result = await tripGenerationService.generateTripsForUser(userId, webhookTaskId || taskQueue.generateTaskId());

          await db.webhookEvent.update({
            where: { id: webhookEvent.id },
            data: {
              processed: true,
              taskId: webhookTaskId || taskQueue.generateTaskId(),
              processedAt: new Date(),
            },
          });

          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);

          await db.webhookEvent.update({
            where: { id: webhookEvent.id },
            data: {
              processed: true,
              error: errorMessage,
              processedAt: new Date(),
            },
          });

          throw error;
        }
      },
      { userId, persistToDb: true }
    );

    return NextResponse.json({
      success: true,
      webhookEventId: webhookEvent.id,
      taskId,
      message: "Trip generation started",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
