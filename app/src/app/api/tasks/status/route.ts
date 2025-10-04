import { inject } from '@/infrastructure/DIContainer';
import { TaskQueue } from '@/infrastructure/TaskQueue';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/tasks/status?taskId=xxx
 * Gets the status of a specific task
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json(
      { error: 'taskId parameter is required' },
      { status: 400 }
    );
  }

  const taskQueue = inject(TaskQueue);
  const task = taskQueue.getTask(taskId);

  if (!task) {
    return NextResponse.json(
      { error: 'Task not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    task
  });
}
