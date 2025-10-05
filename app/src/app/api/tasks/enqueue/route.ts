import { inject } from "@/infrastructure/DIContainer";
import { TaskQueue } from "@/infrastructure/TaskQueue";
import { TripGenerationService } from "@/infrastructure/TripGenerationService";
import { useUserId } from "@/infrastructure/UserAccessor";
import { NextResponse } from "next/server";

export async function POST() {
  const taskQueue = inject(TaskQueue);
  const tripGenerationService = inject(TripGenerationService);
  const userId = await useUserId();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const taskId = taskQueue.enqueue(
    async () => {
      return await tripGenerationService.generateTripsForUser(userId, taskQueue.generateTaskId());
    },
    { userId, persistToDb: true }
  );

  return NextResponse.json({
    success: true,
    taskId,
  });
}