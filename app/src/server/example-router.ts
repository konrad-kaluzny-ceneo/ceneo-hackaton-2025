import { db } from "@/db";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

export const exampleRouter = router({
  getExample: publicProcedure.query(async ({  }) => {
    return "1";
  }),
}); 