# Database Migration Guide

## Running the Migration

After updating the Prisma schema with the new models (`TripProposition`, `WebhookEvent`, and updated `Task`), you need to apply these changes to your database.

### Development Environment

```bash
cd app
npx prisma migrate dev --name add_webhook_and_trip_proposition_models
```

This will:
1. Create a new migration file in `prisma/migrations/`
2. Apply the migration to your development database
3. Regenerate the Prisma Client

### Production Environment

```bash
cd app
npx prisma migrate deploy
```

This applies all pending migrations to your production database without prompting.

## Verifying the Migration

After running the migration, verify the new tables exist:

```bash
cd app
npx prisma studio
```

This opens Prisma Studio where you can:
- View the `TripProposition` table
- View the `WebhookEvent` table  
- Verify the `Task` table has the new `userId` field

## Rollback (if needed)

If you need to rollback the migration:

```bash
cd app
npx prisma migrate reset
```

⚠️ **Warning**: This will delete all data in your development database!

## Seeding Sample Data (Optional)

If you want to add sample webhook events or trip propositions for testing:

```bash
cd app
npx prisma db seed
```

Make sure you have a seed script configured in `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

## Environment Variables Required

Make sure these are set before running migrations:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

For production:
```env
DATABASE_URL="your-production-database-url"
WEBHOOK_SECRET="your-production-webhook-secret"
```

## Troubleshooting

### Migration fails with "relation already exists"
The table might already exist. Try:
```bash
npx prisma db push --skip-generate
```

### Prisma Client out of sync
Regenerate the client:
```bash
npx prisma generate
```

### Database connection issues
Verify your `DATABASE_URL` is correct and the database is accessible.

## Post-Migration Checklist

- [ ] Migration applied successfully
- [ ] Prisma Client regenerated
- [ ] New tables visible in Prisma Studio
- [ ] Environment variables configured
- [ ] Webhook secret set in `.env`
- [ ] Application starts without errors
- [ ] Webhook endpoint accessible at `/api/webhooks/vercel`
