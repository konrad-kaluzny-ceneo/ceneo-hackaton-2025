"use client";

import { cn } from "@/lib/utils";
import { Loader2Icon, MessageSquareIcon } from "lucide-react";
import React, { useContext } from "react";
import { ChatAiContext } from "./ChatAiContext";
import ChatAiMessage from "./ChatAiMessage";

export default function ChatAiMessages() {
  const { isLoading, messages } = useContext(ChatAiContext);

  const loadingMessage = {
    createdAt: new Date(),
    id: "loading",
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2Icon className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    ...(isLoading ? [loadingMessage] : []),
    ...messages,
  ];

  return (
    <div
      className={cn(
        "flex flex-1 flex-col-reverse gap-4 overflow-y-auto p-3"
      )}
    >
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((msg, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage === msg.isUserMessage;

          return (
            <ChatAiMessage
              key={msg.id}
              message={msg}
              isNextMessageSamePerson={isNextMessageSamePerson}
            />
          );
        })
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center pb-12 gap-2">
          <MessageSquareIcon className="h-8 w-8 text-blue-500" />
          <h3 className="text-xl font-semibold">Wszystko gotowe!</h3>
          <p className="text-sm text-zinc-500">
            Zapytaj o szczegóły lokalizacji lub wycieczki.
          </p>
        </div>
      )}
    </div>
  );
}
