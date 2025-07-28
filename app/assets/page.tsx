import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import { AssetsContainer } from "@/components/assets-container";
export default async function AssetsPage() {
  void trpc.getAssets.prefetch(); // prefetch assets
  return (
    <HydrateClient>
      <AssetsContainer />
    </HydrateClient>
  );
}
