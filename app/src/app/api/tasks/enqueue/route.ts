import { callAI } from '@/infrastructure/AIService';
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
        const aiGeneratedTrips = await callAI(`
            Generate a list of 3 trip propositions for a user in JSON format. Each trip should include:
            - destination (string)
            - duration in days (integer)
            - budget in USD (integer)
            - activities (array of strings)
            Ensure the JSON is properly formatted.
            Example:
            {
                "trips": [
                    {
                        "destination": "Paris, France",
                        "duration": 5,
                        "budget": 1500,
                        "activities": ["Eiffel Tower visit", "Louvre Museum tour", "Seine River cruise"]
                    },
                    {
                        "destination": "Kyoto, Japan",
                        "duration": 7,
                        "budget": 2000,
                        "activities": ["Temple visits", "Tea ceremony", "Geisha district tour"]
                    },
                    {
                        "destination": "New York City, USA",
                        "duration": 4,
                        "budget": 1200,
                        "activities": ["Statue of Liberty", "Broadway show", "Central Park walk"]
                    }
                ]
            }
            RETURN ONLY JSON WITHOUT ANY ADDITIONAL TEXT. DO NOT ADD \`\`\`json
        `);

        console.log('AI Generated Trips:', aiGeneratedTrips);


        repository.addTripProposition({
            id: generateId(),
            userId: userId,
            taskId: taskId,
            data: JSON.parse(aiGeneratedTrips),
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

