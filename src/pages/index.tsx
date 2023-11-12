import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ConnectToICRButton } from "~/components/connectToICRButton";
import { api } from "~/utils/api";

export default function Home() {
  const { data: organizations } = api.organization.organizations.useQuery();
  return (
    <>
      <Head>
        <title>Best marketplace</title>
        <meta
          name="description"
          content="This is a carbon credit marketplace that integrates with the ICR registry"
        />
      </Head>
      <main className="min-h-screen px-10 py-5 ">
        <div className="mb-5">
          <h1 className="text-4xl font-bold">Best marketplace</h1>
          <p className="mt-3 text-lg">
            This is a carbon credit marketplace that integrates with the ICR
            registry
          </p>
        </div>
        <div className="flex">
          {organizations && organizations.length > 0 && (
            <div className="flex-1">
              {" "}
              {organizations?.map((org) => {
                const permissions = JSON.parse(org.permissions ?? "") as Record<
                  string,
                  string
                >;
                const keys = Object.keys(permissions);
                return (
                  <Link
                    href={`/organizations/${org.id}`}
                    key={org.id ?? ""}
                    className="mb-5 "
                  >
                    <div className="flex items-center rounded-md p-4 hover:bg-gray-300">
                      <Image
                        alt="Logo"
                        src={org.logo ?? ""}
                        width={100}
                        height={100}
                        className="mr-2 h-14 w-14 rounded-full"
                      />
                      <div>
                        <div className="flex font-bold">
                          {org.fullName}{" "}
                          {org.isSuspended && (
                            <div className="ml-2 rounded-full border border-red-500 bg-red-200 px-1 py-1 text-xs font-light text-red-700">
                              Suspended
                            </div>
                          )}
                        </div>
                        <div className="text-xs">
                          {keys.map((key) => (
                            <div
                              key={key}
                              className="font-medium text-gray-500"
                            >
                              {key}: <span>{permissions[`${key}`]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          <ConnectToICRButton />
        </div>
      </main>
    </>
  );
}
