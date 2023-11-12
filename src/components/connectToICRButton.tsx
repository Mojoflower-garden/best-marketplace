import Link from "next/link";
import { Button } from "~/components/ui/button";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import { Loader2 } from "lucide-react";

export const ConnectToICRButton = () => {
  const { data: stateVariable, isLoading: isLoadingStateVar } =
    api.icr.getStateVar.useQuery();
  return (
    <>
      {isLoadingStateVar && <Loader2 className="w-5" />}
      {!isLoadingStateVar && (
        <Link
          href={`${env.NEXT_PUBLIC_ICR_APP_URL}/apps/${env.NEXT_PUBLIC_ICR_NAME_ID}/installations/new?state=${stateVariable}&redirectUri=http://localhost:3001/api/icrCallback`}
        >
          <Button>Connect to ICR</Button>
        </Link>
      )}
    </>
  );
};
