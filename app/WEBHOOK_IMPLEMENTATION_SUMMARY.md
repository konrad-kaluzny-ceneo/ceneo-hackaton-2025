# Webhook Implementation Summary

## What Was Created

A complete Vercel webhook system that enables server-side trip generation with database persistence. The webhook runs the same trip generation process as the client-side flow but saves all results to Prisma.

## Files Created/Modified

### New Files

1. **`app/src/app/api/webhooks/vercel/route.ts`**
   - Main webhook endpoint handling POST requests
   - Validates webhook signature for security
   - Creates WebhookEvent records for tracking
   - Enqueues trip generation tasks with database persistence
   - Returns taskId for tracking

2. **`app/src/infrastructure/TripGenerationService.ts`**
   - Extracted trip generation logic into reusable service
   - Generates personalized trips using AI and RAG
   - Saves results to Prisma `TripProposition` table
   - Provides methods to query saved propositions

3. **`app/WEBHOOK_SETUP.md`**
   - Comprehensive documentation for webhook usage
   - Authentication setup instructions
   - Request/response examples
   - Database model descriptions
   - Troubleshooting guide

4. **`app/src/infrastructure/README.md`**
   - Documentation for all infrastructure services
   - Usage examples and best practices

5. **`app/.env.example`**
   - Environment variable template
   - Documents required configuration

### Modified Files

1. **`app/prisma/schema.prisma`**
   - Added `TripProposition` model for storing generated trips
   - Added `WebhookEvent` model for tracking webhook invocations
   - Added `userId` field to `Task` model
   - Added indexes for performance

2. **`app/src/infrastructure/TaskQueue.ts`**
   - Added optional database persistence via `persistToDb` flag
   - Made `generateTaskId()` method public for external use
   - Added `persistTaskToDb()` private method
   - Updated `enqueue()` to accept options object with `userId` and `persistToDb`

3. **`app/src/app/api/tasks/enqueue/route.ts`**
   - Refactored to use new `TripGenerationService`
   - Enabled database persistence via TaskQueue options
   - Simplified code by extracting trip generation logic

## Database Models

### TripProposition
```prisma
model TripProposition {
  id        String   @id @default(cuid())
  userId    String
  taskId    String?
  data      String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
Stores AI-generated trip propositions with full trip data as JSON.

### WebhookEvent
```prisma
model WebhookEvent {
  id          String   @id @default(cuid())
  source      String
  eventType   String
  payload     String   @db.Text
  taskId      String?
  processed   Boolean  @default(false)
  error       String?  @db.Text
  createdAt   DateTime @default(now())
  processedAt DateTime?
}
```
Tracks all webhook invocations for monitoring and debugging.

### Task (Updated)
```prisma
model Task {
  id          String     @id @default(cuid())
  status      TaskStatus @default(PENDING)
  progress    Int?       @default(0)
  result      String?    @db.Text
  error       String?    @db.Text
  userId      String?    // NEW FIELD
  createdAt   DateTime   @default(now())
  startedAt   DateTime?
  completedAt DateTime?
}
```
Added `userId` for tracking which user owns each task.

## Key Features

### 1. Security
- Webhook signature validation via `x-vercel-signature` header
- Environment-based secret configuration
- Input validation and sanitization

### 2. Database Persistence
- All webhook events logged to database
- Tasks persisted with full lifecycle tracking
- Trip propositions saved for later retrieval
- Atomic operations with proper error handling

### 3. Async Processing
- Background task queue prevents timeout issues
- Real-time status updates via WebSocket/SSE
- Proper error handling and recovery

### 4. Reusability
- `TripGenerationService` can be used by any component
- Shared logic between webhook and client-side endpoints
- Clean separation of concerns

### 5. Monitoring
- WebhookEvent table tracks all invocations
- Task table shows execution history
- Error messages preserved for debugging

## Usage Flow

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Vercel    │  POST   │   Webhook    │ Enqueue │  TaskQueue  │
│   System    │────────>│   Endpoint   │────────>│             │
└─────────────┘         └──────────────┘         └─────────────┘
                              │                          │
                              │ Create                   │ Process
                              ▼                          ▼
                        ┌─────────────┐          ┌─────────────┐
                        │  Webhook    │          │    Trip     │
                        │   Event     │          │ Generation  │
                        │   (DB)      │          │   Service   │
                        └─────────────┘          └─────────────┘
                                                        │
                                                        │ Save
                                                        ▼
                        ┌──────────────────────────────────────┐
                        │  Database (Prisma)                   │
                        │  - Task (with userId)                │
                        │  - TripProposition                   │
                        │  - WebhookEvent (updated)            │
                        └──────────────────────────────────────┘
```

## Next Steps

1. **Run Prisma Migration**
   ```bash
   cd app
   npx prisma migrate dev --name add_webhook_models
   ```

2. **Set Environment Variables**
   ```bash
   # Add to .env or .env.local
   WEBHOOK_SECRET=your-secure-random-secret-here
   DATABASE_URL=your-postgresql-connection-string
   ```

3. **Configure Vercel Webhook**
   - In Vercel dashboard: Settings > Webhooks
   - Add webhook URL: `https://your-domain.com/api/webhooks/vercel`
   - Set custom header: `x-vercel-signature: your-secret`

4. **Test the Webhook**
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/vercel \
     -H "Content-Type: application/json" \
     -H "x-vercel-signature: your-secret" \
     -d '{"userId": "test-user-123"}'
   ```

5. **Monitor Results**
   ```typescript
   // Query generated trips
   const trips = await db.tripProposition.findMany({
     where: { userId: 'test-user-123' },
     orderBy: { createdAt: 'desc' }
   });
   ```

## Architecture Benefits

✅ **Separation of Concerns**: Trip generation logic extracted into service
✅ **Database Persistence**: All webhook activity and results saved
✅ **Monitoring**: Full audit trail of webhook invocations
✅ **Reusability**: Service can be used by multiple endpoints
✅ **Scalability**: Async processing prevents timeout issues
✅ **Security**: Signature validation and input sanitization
✅ **Maintainability**: Clean, documented, testable code

## Testing Recommendations

Create tests for:
1. Webhook signature validation
2. TripGenerationService AI integration
3. Database persistence in TaskQueue
4. Error handling and recovery
5. WebhookEvent creation and updates
