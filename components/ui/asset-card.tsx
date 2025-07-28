"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ImageIcon,
  Video,
  Sparkles,
  Download,
  Heart,
  Save,
  Trash2,
} from "lucide-react";
import { Asset, AssetType } from "@prisma/client";

interface AssetCardProps {
  asset: Asset;
  variant?: "grid" | "list";
  showActions?: boolean;
  onDownload?: (asset: Asset) => void;
  onSave?: (asset: Asset) => void;
  onDiscard?: (asset: Asset) => void;
  onClick?: (asset: Asset) => void;
  isSelected?: boolean;
}

export function AssetCard({
  asset,
  variant = "grid",
  showActions = false,
  onDownload,
  onSave,
  onDiscard,
  onClick,
  isSelected = false,
}: AssetCardProps) {
  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case AssetType.IMAGE:
        return <ImageIcon className="h-4 w-4" />;
      case AssetType.VIDEO:
        return <Video className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFileExtension = (type: AssetType) => {
    return type === AssetType.IMAGE ? "jpg" : "mp4";
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(asset);
    } else {
      const link = document.createElement("a");
      link.href = asset.url;
      link.download = `asset-${asset.id}.${getFileExtension(asset.type)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const aspectRatio = variant === "grid" ? "aspect-square" : "aspect-video";

  return (
    <Card
      className={`overflow-hidden transition-all ${
        onClick ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "bg-purple-200 shadow-lg"
          : "hover:shadow-lg group"
      }`}
      onClick={() => onClick?.(asset)}
    >
      <div className={`${aspectRatio} bg-gray-100 relative`}>
        {asset.type === AssetType.VIDEO ? (
          <video
            src={asset.url}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            onError={(e) => {
              const target = e.target as HTMLVideoElement;
              target.src = "/placeholder.svg";
            }}
          />
        ) : (
          <img
            src={asset.url}
            alt={`Asset ${asset.id}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        )}

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            {onDownload && (
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Action buttons for saved assets */}
        {showActions && (
          <div className="absolute top-2 right-2 flex gap-1">
            {onSave && !asset.saved && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(asset);
                }}
              >
                <Save className="h-4 w-4" />
              </Button>
            )}
            {onDiscard && !asset.saved && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDiscard(asset);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {getAssetIcon(asset.type)}
            <span className="capitalize">
              {asset.type.toLowerCase()}
            </span>
          </CardTitle>
          {asset.saved && (
            <Heart className="h-4 w-4 text-red-500 fill-current" />
          )}
        </div>
        <p className="text-xs text-gray-500">
          {formatDate(asset.createdAt)}
        </p>
      </CardHeader>
    </Card>
  );
} 