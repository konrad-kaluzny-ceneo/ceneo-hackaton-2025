"use client";

import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";
import { format } from "date-fns";
import { BotIcon, UserIcon } from "lucide-react";

type Message = {
  id: string;
  text: string | React.ReactNode;
  isUserMessage: boolean;
  createdAt: Date;
};

type Props = {
  message: Message;
  isNextMessageSamePerson: boolean;
};

const ChatAiMessage = forwardRef<HTMLDivElement, Props>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex aspect-square h-6 w-6 shrink-0 items-center justify-center rounded-sm",
            {
              "order-2 bg-primary": message.isUserMessage,
              "order-1 bg-slate-600": !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            }
          )}
        >
          {message.isUserMessage ? (
            <UserIcon className="h-4 w-4 text-white" />
          ) : (
            <BotIcon className="h-4 w-4 text-white" />
          )}
        </div>

        <div
          className={cn("mx-2 flex max-w-md flex-col space-y-2 text-base", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("inline-block rounded-lg px-4 py-2", {
              "bg-primary/30 text-slate-800": message.isUserMessage,
              "bg-slate-200 text-slate-800": !message.isUserMessage,
              "rounded-br-none":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-bl-none":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {typeof message.text === "string" ? (
              <div className="text-xs whitespace-pre-wrap">{message.text}</div>
            ) : (
              message.text
            )}

            {message.id !== "loading" ? (
              <div
                className={cn(
                  "mt-2 w-full select-none text-right text-xs text-slate-800"
                )}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

ChatAiMessage.displayName = "ChatAiMessage";

export default ChatAiMessage;
