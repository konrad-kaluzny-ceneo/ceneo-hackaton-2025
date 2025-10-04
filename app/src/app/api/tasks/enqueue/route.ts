import { inject } from '@/infrastructure/DIContainer';
import { Repository } from '@/infrastructure/Repository';
import { TaskQueue } from '@/infrastructure/TaskQueue';
import { NextResponse } from 'next/server';


const repository = inject(Repository);


/**
 * POST /api/tasks/enqueue
 * Enqueues a long-running task
 * Body: { userId: string }
 */
export async function POST(request: Request) {
    const taskQueue = inject(TaskQueue);
    
    const body = await request.json();
    const userId = body.userId;

    if (!userId) {
        return NextResponse.json(
            { error: 'userId is required' },
            { status: 400 }
        );
    }

    const taskId = taskQueue.enqueue(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const aiGeneratedTrips = { trips: [] };

        repository.addTripProposition({
            id: generateId(),
            userId: userId,
            taskId: taskId,
            data: aiGeneratedTrips,
            createdAt: new Date()
        });

        return {
            message: 'Task completed successfully!',
            completedAt: new Date().toISOString(),
            data: aiGeneratedTrips
        };
    });

    return NextResponse.json({
        success: true,
        taskId
    });
}
function generateId(): string {
    return crypto.randomUUID();
}

