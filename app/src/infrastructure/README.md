# Infrastructure Services

This directory contains core infrastructure services used throughout the application.

## Services

### TripGenerationService

Service responsible for generating personalized trip propositions using AI and saving them to the database.

**Methods:**
- `generateTripsForUser(userId, taskId)`: Generates 3 trip propositions for a user
- `getTripPropositionsByUserId(userId)`: Retrieves all propositions for a user
- `getTripPropositionByTaskId(taskId)`: Retrieves a specific proposition by task ID

**Usage:**
```typescript
import { inject } from "@/infrastructure/DIContainer";
import { TripGenerationService } from "@/infrastructure/TripGenerationService";

const service = inject(TripGenerationService);
const result = await service.generateTripsForUser("user-123", "task-456");
```

### TaskQueue

In-memory task queue for background processing with optional database persistence.

**Features:**
- Queues long-running tasks
- Tracks task status (PENDING, RUNNING, COMPLETED, FAILED)
- Real-time updates via listeners and WebSocket
- Optional Prisma persistence
- Automatic cleanup of old tasks

**Usage:**
```typescript
import { inject } from "@/infrastructure/DIContainer";
import { TaskQueue } from "@/infrastructure/TaskQueue";

const taskQueue = inject(TaskQueue);

const taskId = taskQueue.enqueue(
  async () => {
    return "Task result";
  },
  { 
    userId: "user-123", 
    persistToDb: true 
  }
);

const task = taskQueue.getTask(taskId);
console.log(task.status);
```

### Repository

In-memory repository for context items and trip propositions (legacy - prefer using TripGenerationService with Prisma).

### DIContainer

Dependency injection container for managing singleton instances of services.

**Usage:**
```typescript
import { inject } from "@/infrastructure/DIContainer";
import { MyService } from "./MyService";

const service = inject(MyService);
```

### WebSocketManager

Manages WebSocket connections for real-time task updates (used with TaskQueue).

### AIService

Wrapper for AI API calls (OpenAI, etc).

**Usage:**
```typescript
import { callAI } from "@/infrastructure/AIService";

const response = await callAI("Your prompt here");
```

### UserAccessor

Service for accessing current user information in server components.

**Usage:**
```typescript
import { useUserId } from "@/infrastructure/UserAccessor";

export async function GET() {
  const userId = await useUserId();
  // ...
}
```

## Database Persistence

Services that support database persistence (via Prisma):
- **TripGenerationService**: Always persists to DB
- **TaskQueue**: Persists when `persistToDb: true` is set in options

## Task Processing Flow

1. Client or webhook calls `/api/tasks/enqueue` or `/api/webhooks/vercel`
2. TaskQueue receives the task with a handler function
3. Task is queued and status set to PENDING
4. TaskQueue processes the queue asynchronously
5. Task status updates to RUNNING, then COMPLETED or FAILED
6. If persistence enabled, task is saved to database at each status change
7. Listeners and WebSocket subscribers receive real-time updates
8. Client can poll `/api/tasks/status?taskId=xxx` or listen via SSE at `/api/tasks/ws?taskId=xxx`
