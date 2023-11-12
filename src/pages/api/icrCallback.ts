import axios from "axios";
import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { createJWT } from "~/utils/auth";
import {
  type IOrganization,
  addOrganization,
  validStateVariables,
} from "~/utils/db";

export default async function icrCallbackHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { installationId, state, event } = req.query;

  console.log("req.query", req.query);
  if (typeof installationId !== "string") {
    return res.redirect("/?error=invalid_installation_id");
  }

  if (typeof state !== "string") {
    return res.redirect("/?error=invalid_state");
  }

  // Verifying that the state variable is valid
  if (!validStateVariables.find((stateVariable) => stateVariable === state)) {
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
    const organization = data.organization as IOrganization;

    addOrganization({
      ...organization,
      installationId: installationId,
    }); // Here you should probably add the organization to your database and connect it to the user that initiated the installation

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/?error=install_error");
    return;
  }
}
