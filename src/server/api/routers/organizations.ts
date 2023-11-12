import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const organizationRouter = createTRPCRouter({
  organizations: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.organizations.findMany();
  }),
  get: publicProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.organizations.findFirst({
        where: {
          id: input.organizationId,
        },
      });
    }),
});
