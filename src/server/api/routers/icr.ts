import { TRPCError } from "@trpc/server";
import axios from "axios";
import { randomBytes } from "crypto";
import { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createJWT, getInstallationAccessToken } from "~/utils/auth";
import {
  CreditActionEnum,
  ICredit,
  ICreditRequests,
  IReservation,
  IRetirement,
} from "~/utils/icrTypes";

export const icrRouter = createTRPCRouter({
  getStateVar: publicProcedure.query(async ({ ctx }) => {
    const userId = randomBytes(16).toString("hex");
    const integrationStateVariable = `${userId}-${Math.random()
      .toString(36)
      .substring(7)}`;

    await ctx.db.user.create({
      data: {
        id: userId,
      },
    });
    return integrationStateVariable;
  }),
  organizationWarehouseInventory: publicProcedure
    .input(
      z.object({
        organizationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const accessToken = await getInstallationAccessToken(
        input.organizationId,
      );
      try {
        const inv = await axios.get(
          `${env.ICR_API_URL}/organizations/${input.organizationId}/warehouse/inventory`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.token}`,
              "x-icr-api-version": "2023-06-16",
            },
          },
        );
        return inv.data as { credits: ICredit[]; organizationId: string };
      } catch (error: any) {
        console.error(error);
        throw new TRPCError({
          code:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "FORBIDDEN"
              : "INTERNAL_SERVER_ERROR",
          message:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "Forbidden - Insufficient permissions"
              : "Something went wrong",
        });
      }
    }),
  warehouseReservations: publicProcedure
    .input(
      z.object({
        organizationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const accessToken = await getInstallationAccessToken(
        input.organizationId,
      );
      try {
        const inv = await axios.get(
          `${env.ICR_API_URL}/organizations/${input.organizationId}/warehouse/inventory/reservations`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.token}`,
              "x-icr-api-version": "2023-06-16",
            },
          },
        );
        return inv.data.reservations as IReservation[];
        [];
      } catch (error: any) {
        console.error(error);
        throw new TRPCError({
          code:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "FORBIDDEN"
              : "INTERNAL_SERVER_ERROR",
          message:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "Forbidden - Insufficient permissions"
              : "Something went wrong",
        });
      }
    }),
  inventoryRequests: publicProcedure
    .input(
      z.object({
        organizationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const accessToken = await getInstallationAccessToken(
        input.organizationId,
      );
      try {
        const inv = await axios.get(
          `${env.ICR_API_URL}/organizations/${input.organizationId}/inventory/requests`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.token}`,
              "x-icr-api-version": "2023-06-16",
            },
          },
        );
        return inv.data.creditRequests as ICreditRequests[];
      } catch (error: any) {
        console.error(error);
        throw new TRPCError({
          code:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "FORBIDDEN"
              : "INTERNAL_SERVER_ERROR",
          message:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "Forbidden - Insufficient permissions"
              : "Something went wrong",
        });
      }
    }),
  organizationRetirements: publicProcedure
    .input(
      z.object({
        organizationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const accessToken = await getInstallationAccessToken(
        input.organizationId,
      );
      try {
        const inv = await axios.get(
          `${env.ICR_API_URL}/organizations/${input.organizationId}/retirements`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.token}`,
              "x-icr-api-version": "2023-06-16",
            },
          },
        );

        return inv.data.retirements as IRetirement[];
      } catch (error: any) {
        console.error(error);
        throw new TRPCError({
          code:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "FORBIDDEN"
              : "INTERNAL_SERVER_ERROR",
          message:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "Forbidden - Insufficient permissions"
              : "Something went wrong",
        });
      }
    }),
  organizationInventory: publicProcedure
    .input(
      z.object({
        organizationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const accessToken = await getInstallationAccessToken(
        input.organizationId,
      );
      try {
        const inv = await axios.get(
          `${env.ICR_API_URL}/organizations/${input.organizationId}/inventory`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.token}`,
              "x-icr-api-version": "2023-06-16",
            },
          },
        );
        return inv.data as { credits: ICredit[]; organizationId: string };
      } catch (error: any) {
        console.error(error);
        throw new TRPCError({
          code:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "FORBIDDEN"
              : "INTERNAL_SERVER_ERROR",
          message:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "Forbidden - Insufficient permissions"
              : "Something went wrong",
        });
      }
    }),
  createICRUserAndOrganization: publicProcedure
    .input(
      z.object({
        user: z.object({
          email: z.string(),
          fullName: z.string().optional(),
          profilePicture: z.string().optional(),
        }),
        organization: z.object({
          fullName: z.string(),
          type: z.string(),
          countryCode: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const accessToken = createJWT();
      try {
        const res = await axios.post(
          `${env.ICR_API_URL}/app/create/user/organization`,
          {
            user: input.user,
            organization: input.organization,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "x-icr-api-version": "2023-06-16",
            },
          },
        );

        return {
          installation: res.data.installation as { id: string },
        };
      } catch (error: any) {
        console.error(error);
        throw new TRPCError({
          code:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "FORBIDDEN"
              : "INTERNAL_SERVER_ERROR",
          message:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "Forbidden - Insufficient permissions"
              : "Something went wrong",
        });
      }
    }),
  finishReservation: publicProcedure
    .input(
      z.object({
        reservationId: z.string(),
        organizationId: z.string().min(32, {
          message: "Organization Ids must be at least 32 characters.",
        }),
        receiverId: z.string().min(32, {
          message: "Organization Ids must be at least 32 characters.",
        }),
        action: z.nativeEnum(CreditActionEnum),
        retirementData: z
          .object({
            reason: z.string(),
            beneficiaryName: z.string(),
            comment: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const accessToken = await getInstallationAccessToken(
        input.organizationId,
      );
      try {
        await axios.post(
          `${env.ICR_API_URL}/organizations/${input.organizationId}/warehouse/inventory/reservations/${input.reservationId}/${input.action}`,
          {
            receiverId: input.receiverId,
            retirementData: input.retirementData,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken.token}`,
              "x-icr-api-version": "2023-06-16",
            },
          },
        );
        return true;
      } catch (error: any) {
        console.error(error);
        throw new TRPCError({
          code:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "FORBIDDEN"
              : "INTERNAL_SERVER_ERROR",
          message:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "Forbidden - Insufficient permissions"
              : "Something went wrong",
        });
      }
    }),
  requestCreditAction: publicProcedure
    .input(
      z.object({
        organizationId: z.string().min(32, {
          message: "Organization Ids must be at least 32 characters.",
        }),
        toOrganizationId: z
          .string()
          .min(32, {
            message: "Organization Ids must be at least 32 characters.",
          })
          .optional(),
        toAddress: z.string().optional(),
        action: z.nativeEnum(CreditActionEnum),
        amount: z.number().gt(0),
        creditId: z.string(),
        retirementData: z
          .object({
            reason: z.string(),
            beneficiaryName: z.string(),
            comment: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const accessToken = await getInstallationAccessToken(
        input.organizationId,
      );
      try {
        await axios.post(
          `${env.ICR_API_URL}/organizations/${input.organizationId}/inventory/requests/${input.action}`,
          {
            creditId: input.creditId,
            toOrganizationId: input.toOrganizationId,
            toAddress: input.toAddress,
            amount: input.amount,
            retirementData: input.retirementData,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken.token}`,
              "x-icr-api-version": "2023-06-16",
            },
          },
        );
        console.log("DONE REQUESTING CREDIT ACTION");
        return true;
      } catch (error: any) {
        console.log("ERROR REQUESTING CREDIT ACTION");
        console.error(error);
        throw new TRPCError({
          code:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "FORBIDDEN"
              : "INTERNAL_SERVER_ERROR",
          message:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "Forbidden - Insufficient permissions"
              : "Something went wrong",
        });
      }
    }),
  reserveWarehouseCreditAction: publicProcedure
    .input(
      z.object({
        organizationId: z.string().min(32, {
          message: "Organization Ids must be at least 32 characters.",
        }),
        amount: z.number().gt(0),
        creditId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const accessToken = await getInstallationAccessToken(
        input.organizationId,
      );
      try {
        await axios.post(
          `${env.ICR_API_URL}/organizations/${input.organizationId}/warehouse/inventory/reservations`,
          {
            creditId: input.creditId,
            organizationId: input.organizationId,
            amount: input.amount,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken.token}`,
              "x-icr-api-version": "2023-06-16",
            },
          },
        );
        return true;
      } catch (error: any) {
        console.error(error);
        throw new TRPCError({
          code:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "FORBIDDEN"
              : "INTERNAL_SERVER_ERROR",
          message:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "Forbidden - Insufficient permissions"
              : "Something went wrong",
        });
      }
    }),
  cancelReservation: publicProcedure
    .input(
      z.object({
        reservationId: z.string(),
        organizationId: z.string().min(32, {
          message: "Organization Ids must be at least 32 characters.",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const accessToken = await getInstallationAccessToken(
        input.organizationId,
      );
      try {
        await axios.delete(
          `${env.ICR_API_URL}/organizations/${input.organizationId}/warehouse/inventory/reservations/${input.reservationId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.token}`,
              "x-icr-api-version": "2023-06-16",
            },
          },
        );
        return true;
      } catch (error: any) {
        console.error(error);
        throw new TRPCError({
          code:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "FORBIDDEN"
              : "INTERNAL_SERVER_ERROR",
          message:
            error.response.data.error === "Forbidden" ||
            error.response.data.error === "Unauthorized"
              ? "Forbidden - Insufficient permissions"
              : "Something went wrong",
        });
      }
    }),
  getSecrets: publicProcedure
    .input(
      z.object({
        organizationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const accessToken = await getInstallationAccessToken(
        input.organizationId,
      );
      return {
        token: accessToken.token,
        baseURL: env.ICR_API_URL,
      };
    }),
});
