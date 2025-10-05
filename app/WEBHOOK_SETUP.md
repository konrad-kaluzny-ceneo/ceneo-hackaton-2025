# Vercel Webhook Setup Guide

## Overview

The Vercel webhook endpoint enables external systems to trigger trip generation processes on the server side. When invoked, it creates a background task that generates personalized trip propositions and stores them in the Prisma database.

## Endpoint

```
POST /api/webhooks/vercel
```

## Authentication

The webhook uses a shared secret for authentication. Set the `WEBHOOK_SECRET` environment variable in your `.env` file:

```env
WEBHOOK_SECRET=your-secure-secret-key-here
```

The webhook request must include this secret in the `x-vercel-signature` header:

```
x-vercel-signature: your-secure-secret-key-here
```

## Request Payload

```json
{
  "userId": "user-123",
  "taskId": "optional-custom-task-id",
  "type": "trip_generation"
}
```

### Required Fields
- `userId` (string): The ID of the user for whom trips should be generated

### Optional Fields
- `taskId` (string): Custom task ID for tracking (auto-generated if not provided)
- `type` (string): Event type identifier (defaults to "trip_generation")

## Response

### Success Response (200)
```json
{
  "success": true,
  "webhookEventId": "webhook-event-id",
  "taskId": "task-id",
  "message": "Trip generation started"
}
```

### Error Responses

**Unauthorized (401)**
```json
{
  "error": "Unauthorized"
}
```

**Bad Request (400)**
```json
{
  "error": "userId is required in payload"
}
```

**Internal Server Error (500)**
```json
{
  "error": "Failed to process webhook",
  "details": "Error message details"
}
```

## How It Works

1. **Webhook Receives Request**: The endpoint validates the signature and creates a `WebhookEvent` record in the database
2. **Task Enqueued**: A background task is enqueued in the TaskQueue
3. **Trip Generation**: The task calls `TripGenerationService.generateTripsForUser()` which:
   - Fetches user context from the repository
   - Searches for relevant attractions using RAG
   - Calls AI to generate 3 personalized trip propositions
   - Stores results in both `TripProposition` and `Task` tables
4. **Webhook Updated**: The `WebhookEvent` record is updated with the task result or error
5. **Client Notification**: If WebSocket is configured, clients are notified via SSE

## Database Models

### WebhookEvent
Tracks all webhook invocations:
- `id`: Unique identifier
- `source`: Origin of webhook ("vercel")
- `eventType`: Type of event ("trip_generation")
- `payload`: Full request payload (JSON string)
- `taskId`: Associated task ID
- `processed`: Boolean flag indicating completion
- `error`: Error message if processing failed
- `createdAt`: Timestamp of webhook receipt
- `processedAt`: Timestamp of completion

### Task
Tracks background task execution:
- `id`: Unique identifier
- `userId`: User who initiated the task
- `status`: PENDING | RUNNING | COMPLETED | FAILED
- `progress`: Percentage completion (0-100)
- `result`: Serialized task result (JSON string)
- `error`: Error message if failed
- `createdAt`, `startedAt`, `completedAt`: Timestamps

### TripProposition
Stores generated trip data:
- `id`: Unique identifier
- `userId`: Owner of the trip proposition
- `taskId`: Task that generated this proposition
- `data`: Trip data (JSON string)
- `createdAt`, `updatedAt`: Timestamps

## Example Usage

### Using cURL

```bash
curl -X POST https://your-domain.com/api/webhooks/vercel \
  -H "Content-Type: application/json" \
  -H "x-vercel-signature: your-secure-secret-key-here" \
  -d '{
    "userId": "user-123",
    "type": "trip_generation"
  }'
```

### Using JavaScript/TypeScript

```typescript
const response = await fetch('https://your-domain.com/api/webhooks/vercel', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-vercel-signature': process.env.WEBHOOK_SECRET,
  },
  body: JSON.stringify({
    userId: 'user-123',
    type: 'trip_generation',
  }),
});

const result = await response.json();
console.log('Task started:', result.taskId);
```

## Configuring Vercel Webhooks

1. Go to your Vercel project dashboard
2. Navigate to Settings > Webhooks
3. Click "Add Webhook"
4. Enter your webhook URL: `https://your-domain.com/api/webhooks/vercel`
5. Select the events you want to trigger the webhook
6. Add a custom header: `x-vercel-signature: your-secret`
7. Save the webhook

## Monitoring

You can monitor webhook executions by querying the database:

```typescript
import { db } from '@/db';

const recentWebhooks = await db.webhookEvent.findMany({
  where: { 
    source: 'vercel',
    createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  },
  orderBy: { createdAt: 'desc' },
  take: 100,
});

const failedWebhooks = await db.webhookEvent.findMany({
  where: { 
    processed: true,
    error: { not: null }
  },
  orderBy: { createdAt: 'desc' },
});
```

## Security Considerations

1. **Always use HTTPS** in production
2. **Keep WEBHOOK_SECRET secure** - use a strong, randomly generated value
3. **Validate payload structure** before processing
4. **Rate limit webhook requests** to prevent abuse
5. **Monitor failed attempts** for potential security issues
6. **Rotate secrets periodically**

## Troubleshooting

### Webhook returns 401 Unauthorized
- Verify `WEBHOOK_SECRET` is set correctly in environment variables
- Check that the `x-vercel-signature` header matches the secret

### Task fails to complete
- Check application logs for error details
- Verify user context data exists for the given `userId`
- Ensure AI service is configured and operational
- Check database connectivity

### No trip propositions generated
- Verify the task completed successfully (check `Task` table)
- Look for errors in the `WebhookEvent` table
- Check the `TripProposition` table for the user and task ID
