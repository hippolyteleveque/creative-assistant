"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, RotateCcw } from "lucide-react";
import type { Message } from "@/types/messages";
import { useRef, useEffect } from "react";

interface ChatSectionProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

export function ChatSection({
  messages,
  input,
  setInput,
  isTyping,
  messagesEndRef,
  onSubmit,
  onReset,
}: ChatSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input after submission when not typing
  useEffect(() => {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  return (
    <div className="flex-1 flex flex-col bg-white border-r">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-600" />
            Creative Assistant
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isTyping}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.content}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-100">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[70%] ${
                  message.role === "user" ? "order-first" : ""
                }`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    {message.actions.map((action) => (
                      <div key={action} className="bg-gray-100 rounded-md p-1">
                        {action}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100">
                    <User className="h-4 w-4 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-100">
                  <Bot className="h-4 w-4 text-purple-600" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you'd like to create..."
            className="flex-1"
            disabled={isTyping}
            autoFocus={true}
          />
          <Button type="submit" disabled={isTyping || !input.trim()} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
