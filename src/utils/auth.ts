import { organizations } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { randomBytes } from "crypto";
import { sign } from "jsonwebtoken";
import { env } from "~/env.mjs";
import { db } from "~/server/db";

interface CustomClaims {
  iss: string; // Issuer
  exp: number; // Expiration Time (Unix timestamp)
  iat: number; // Issued At (Unix timestamp)
  alg: string; // Algorithm
}

export function createJWT(): string {
  const additionalClaims: CustomClaims = {
    iss: env.NEXT_PUBLIC_ICR_APP_ID, // Replace with your ICR App's ID
    exp: Math.floor(Date.now() / 1000) + 600, // 10 minutes in the future
    iat: Math.floor(Date.now() / 1000) - 60, // 60 seconds in the past
    alg: "RS256",
  };

  // Merge additional claims with the data payload
  const payload = { ...additionalClaims };

  // Create a JWT token
  const token = sign(payload, env.ICR_PRIVATE_KEY, {
    algorithm: "RS256",
  });

  return token;
}

export const getInstallationAccessToken = async (organizationId: string) => {
  // let accessToken = await db.accessTokens.findFirst({
  //   where: {
  //     organizationId,
  //     expiresAt: {
  //       gt: new Date(),
  //     },
  //   },
  // });
  let accessToken = null;
  if (!accessToken) {
    const org = await getOrganization(organizationId);
    const jwt = createJWT();
    try {
      const res = await axios.post(
        `${env.ICR_API_URL}/app/installations/${org?.installationId}/accessTokens`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      const data = res.data as { expiresAt: string; token: string };
      accessToken = {
        expiresAt: new Date(data.expiresAt),
        token: data.token,
        organizationId,
        id: randomBytes(16).toString("hex"),
      };
      await db.accessTokens.create({
        data: accessToken,
      });
    } catch (error: unknown) {
      const errorResponse: {
        response: {
          data: {
            statusCode: number;
            message: string | string[];
          };
        };
      } = error as {
        response: {
          data: {
            statusCode: number;
            message: string | string[];
          };
        };
      };
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: Array.isArray(errorResponse.response.data.message)
          ? errorResponse.response.data.message[0]
          : errorResponse.response.data.message,
      });
    }
  }
  return accessToken;
};

export const getOrganization = async (organizationId: string) => {
  let organization = await db.organizations.findFirst({
    where: {
      id: organizationId,
    },
  });
  if (!organization) {
    const allInstallations = await getAllInstallations();
    organization = allInstallations.find(
      (installation) => installation.organization.id === organizationId,
    )?.organization as organizations;
    if (!organization)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Organization not found",
      });
  }
  return organization;
};

export const getAllInstallations = async () => {
  try {
    const res = await axios.get(`${env.ICR_API_URL}/app/installations`, {
      headers: {
        Authorization: `Bearer ${createJWT()}`,
      },
    });
    const data = res.data as {
      pagination: unknown;
      installations: { id: string; organization: { id: string } }[];
    };
    return data.installations;
  } catch (error: unknown) {
    const errorResponse: {
      response: {
        data: {
          statusCode: number;
          message: string | string[];
        };
      };
    } = error as {
      response: {
        data: {
          statusCode: number;
          message: string | string[];
        };
      };
    };
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: Array.isArray(errorResponse.response.data.message)
        ? errorResponse.response.data.message[0]
        : errorResponse.response.data.message,
    });
  }
};
