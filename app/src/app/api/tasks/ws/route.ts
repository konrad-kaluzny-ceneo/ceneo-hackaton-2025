import { inject } from '@/infrastructure/DIContainer';
import { TaskQueue } from '@/infrastructure/TaskQueue';
import { NextRequest } from 'next/server';

/**
 * Server-Sent Events (SSE) endpoint for real-time task updates
 * GET /api/tasks/ws?taskId=xxx
 * 
 * Using SSE instead of WebSocket because Next.js doesn't support native WebSocket upgrades
 * SSE is simpler and works perfectly for server-to-client updates
 */
export async function GET(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get('taskId');
  
  if (!taskId) {
    return new Response('taskId parameter is required', { status: 400 });
  }

  const taskQueue = inject(TaskQueue);

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      // Send initial task state
      const initialTask = taskQueue.getTask(taskId);
      if (initialTask) {
        const data = `data: ${JSON.stringify({ type: 'TASK_UPDATE', task: initialTask })}\n\n`;
        controller.enqueue(encoder.encode(data));
      }

      // Subscribe to task updates
      const unsubscribe = taskQueue.subscribe(taskId, (task) => {
        try {
          const data = `data: ${JSON.stringify({ type: 'TASK_UPDATE', task })}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch (error) {
          console.error('SSE send error:', error);
        }
      });

      // Send keepalive every 30 seconds
      const keepaliveInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': keepalive\n\n'));
        } catch (error) {
          clearInterval(keepaliveInterval);
        }
      }, 30000);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(keepaliveInterval);
        unsubscribe();
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
