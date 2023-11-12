import { organizations } from "@prisma/client";
import axios from "axios";
import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { createJWT } from "~/utils/auth";

export default async function icrCallbackHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { installationId, state, event } = req.query;
  if (typeof installationId !== "string") {
    return res.redirect("/?error=invalid_installation_id");
  }

  if (typeof state !== "string") {
    return res.redirect("/?error=invalid_state");
  }

  const user = await db.user.findFirst({
    where: {
      id: state.split("-")[0], // This state should be a jwt or something that you generated when the user initiated the installation where you can identify the user. Note: it should probably not be the Id like in this example.
    },
  });

  if (!user) {
    return res.redirect("/?error=invalid_state");
  }

  const jwt = createJWT();
  try {
    const response = await axios.get(
      `${env.ICR_API_URL}/app/installations/${installationId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    const data = response.data;
    delete data.organization.organizationIndustries;
    delete data.organization.url;
    const organization = data.organization as organizations;

    await db.organizations.create({
      data: {
        ...organization,
        permissions: JSON.stringify(data.permissions),
        installationId: installationId,
      },
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/?error=install_error");
    return;
  }
}
