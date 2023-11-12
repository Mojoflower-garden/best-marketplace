import Head from "next/head";
import { ConnectToICRButton } from "~/components/connectToICRButton";

export default function Home() {
  return (
    <>
      <Head>
        <title>Best marketplace</title>
        <meta
          name="description"
          content="This is a carbon credit marketplace that integrates with the ICR registry"
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Best marketplace</h1>
        <p className="mt-3 text-lg">
          This is a carbon credit marketplace that integrates with the ICR
          registry
        </p>
        <ConnectToICRButton />
      </main>
    </>
  );
}
