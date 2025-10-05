import { TRPCError, initTRPC } from "@trpc/server";
import { db } from "@/db";
import superjson from 'superjson';

const t = initTRPC.create(
  {
    transformer: superjson,
  }
);

const middleware = t.middleware;

export const router = t.router;
export const publicProcedure = t.procedure;