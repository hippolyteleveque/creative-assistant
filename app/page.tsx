"use client";

import { useState, useRef, useEffect } from "react";
import { ChatSection } from "@/components/chat/chat-section";
import { AssetsSection } from "@/components/chat/assets-section";
import { trpc } from "@/trpc/client";
import { Message } from "@/types/messages";
import { Asset, AssetType } from "@prisma/client";

export default function ChatPage() {
  const [conversation, setConversation] = useState<{
    id?: string;
    messages: Message[];
  }>({ messages: [] });
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: chat, isPending } = trpc.chat.useMutation();
  const { mutateAsync: saveAsset } = trpc.saveAsset.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setConversation((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          content: input,
          role: "user",
        },
      ],
    }));
    setInput("");
    const response = await chat({
      message: input,
      ...(conversation.id && { conversationId: conversation.id }),
      ...(selectedAsset?.id && { inputAssetId: selectedAsset.id }),
    });
    setAssets((prev) => [...prev, ...response.assets]);
    setConversation((prev) => ({
      ...prev,
      id: response.conversationId,
      messages: [...prev.messages, response.message],
    }));
  };

  const handleSaveAsset = async (asset: Asset) => {
    await saveAsset({ assetId: asset.id });
    setAssets((prev) =>
      prev.map((a) => (a.id === asset.id ? { ...a, saved: true } : a))
    );
  };

  const handleSelectAsset = (asset: Asset) => {
    // only image can be selected
    setSelectedAsset(
      selectedAsset?.id === asset.id && asset.type === AssetType.IMAGE
        ? null
        : asset
    );
  };

  const handleClearAssets = () => {
    setAssets([]);
    setSelectedAsset(null);
  };

  const handleRemoveAsset = (asset: Asset) => {
    setAssets((prev) => prev.filter((a) => a.id !== asset.id));
    if (selectedAsset?.id === asset.id) {
      setSelectedAsset(null);
    }
  };

  const handleReset = () => {
    setConversation({ messages: [] });
    setAssets([]);
    setSelectedAsset(null);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSection
        messages={conversation.messages}
        input={input}
        setInput={setInput}
        isTyping={isPending}
        messagesEndRef={messagesEndRef}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
      <AssetsSection
        assets={assets}
        selectedAsset={selectedAsset}
        onSelectAsset={handleSelectAsset}
        onClearAssets={handleClearAssets}
        onSaveAsset={handleSaveAsset}
        onDiscardAsset={handleRemoveAsset}
      />
    </div>
  );
}
