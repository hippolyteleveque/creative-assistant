import { prisma } from "@/lib/db";
import { Asset } from "@prisma/client";

export const saveAsset = async (assetId: string) => {
  const asset = await prisma.asset.update({
    where: { id: assetId },
    data: { saved: true },
  });
  return asset;
};

export const getAssets = async (): Promise<Asset[]> => {
  const assets = await prisma.asset.findMany({
    where: { saved: true },
    orderBy: { createdAt: "desc" },
  });
  return assets;
};

export const getConversationAssets = async (
  conversationId: string
): Promise<Asset[]> => {
  const assets = await prisma.asset.findMany({
    where: { saved: true, conversationId },
    orderBy: { createdAt: "desc" },
  });
  return assets;
};
