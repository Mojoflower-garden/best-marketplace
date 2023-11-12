import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { validStateVariables } from "~/utils/db";

export const icrRouter = createTRPCRouter({
  getStateVar: publicProcedure.query(() => {
    const userId = "some_user_id";
    const integrationStateVariable = `${userId}-${Math.random()
      .toString(36)
      .substring(7)}`;
    validStateVariables.push(integrationStateVariable);
    return integrationStateVariable;
  }),
});
