"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { ChatAiContext } from "./ChatAiContext";

export default function ChatAiInput() {
  const { addMessage, handleInputChange, isLoading, message } =
    React.useContext(ChatAiContext);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <div className="relative">
      <textarea
        rows={1}
        autoFocus
        placeholder="Czego potrzebujesz?"
        ref={textareaRef}
        onChange={handleInputChange}
        value={message}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            addMessage(message);
            textareaRef.current?.focus();
          }
        }}
        className={cn(
          "w-full resize-none rounded-md border border-gray-300 px-3 py-3.5 pr-12 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        )}
      />

      <Button
        disabled={isLoading || !message.trim()}
        aria-label="wyślij wiadomość"
        className="absolute bottom-1.5 right-[8px]"
        size="sm"
        onClick={() => {
          addMessage(message);
          textareaRef.current?.focus();
        }}
      >
        <SendIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
