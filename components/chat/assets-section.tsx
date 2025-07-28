"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageIcon, Sparkles, Save, Trash2, Video } from "lucide-react";
import { Asset, AssetType } from "@prisma/client";
import Link from "next/link";

interface AssetsSectionProps {
  assets: Asset[];
  selectedAsset: Asset | null;
  onSelectAsset: (asset: Asset) => void;
  onClearAssets: () => void;
  onSaveAsset?: (asset: Asset) => void;
  onDiscardAsset?: (asset: Asset) => void;
}

export function AssetsSection({
  assets,
  selectedAsset,
  onSelectAsset,
  onClearAssets,
  onSaveAsset,
  onDiscardAsset,
}: AssetsSectionProps) {
  const getAssetIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-1/3 bg-gray-50 flex flex-col">
      <div className="border-b p-4 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Generated Assets
          </h2>
          <Link href="/assets">
            <Button variant="ghost" size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              All Assets
            </Button>
          </Link>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {assets.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Generated assets will appear here</p>
            <p className="text-sm mt-2">
              Start a conversation to see creative content!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;
              return (
                <Card
                  key={asset.url}
                  className={`overflow-hidden cursor-pointer transition-all ${
                    isSelected ? "bg-purple-200 shadow-lg" : "hover:shadow-md"
                  }`}
                  onClick={() => onSelectAsset(asset)}
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {asset.type === AssetType.VIDEO ? (
                      <video
                        src={asset.url || "/placeholder.svg"}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={asset.url || "/placeholder.svg"}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {onSaveAsset && !asset.saved && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSaveAsset(asset);
                          }}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      )}
                      {onDiscardAsset && !asset.saved && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDiscardAsset(asset);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {getAssetIcon(asset.type)}
                    </CardTitle>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {assets.length > 0 && (
        <div className="border-t p-4 bg-white">
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={onClearAssets}
          >
            Clear Assets
          </Button>
        </div>
      )}
    </div>
  );
}
