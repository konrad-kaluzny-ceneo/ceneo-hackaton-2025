"use client";

import React from "react";
import { toast } from "sonner";

type Message = {
  id: string;
  text: string;
  isUserMessage: boolean;
  createdAt: Date;
};

type StreamResponse = {
  addMessage: (message: string) => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  messages: Message[];
};

export const ChatAiContext = React.createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
  messages: [],
});

interface Props {
  locationId: string;
  children: React.ReactNode;
}

export const ChatAiContextProvider = ({ locationId, children }: Props) => {
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = React.useState<
    Array<{ role: string; content: string }>
  >([]);

  const backupMessage = React.useRef("");

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    backupMessage.current = userMessage;
    setMessage("");

    const userMsg: Message = {
      id: crypto.randomUUID(),
      text: userMessage,
      isUserMessage: true,
      createdAt: new Date(),
    };

    setMessages((prev) => [userMsg, ...prev]);
    setIsLoading(true);

    const newHistory = [
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    try {
      const response = await fetch("/api/location-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationId,
          message: userMessage,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas wysyłania wiadomości.");
      }

      const stream = response.body;
      if (!stream) {
        throw new Error("Brak strumienia odpowiedzi.");
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accResponse = "";

      const aiMessageId = crypto.randomUUID();

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          const chunkValue = decoder.decode(value);
          const combinedChunkValue = chunkValue
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line) => line.replace(/0:"/, "").replace(/"/, ""))
            .join("");
          accResponse += combinedChunkValue;

          setMessages((prev) => {
            const existingAiMsg = prev.find((m) => m.id === aiMessageId);
            if (existingAiMsg) {
              return prev.map((m) =>
                m.id === aiMessageId ? { ...m, text: accResponse } : m
              );
            } else {
              return [
                {
                  id: aiMessageId,
                  text: accResponse,
                  isUserMessage: false,
                  createdAt: new Date(),
                },
                ...prev,
              ];
            }
          });
        }
      }

      setConversationHistory([
        ...newHistory,
        { role: "assistant", content: accResponse },
      ]);
    } catch (error) {
      setMessage(backupMessage.current);
      toast.error(
        "Pojawił się błąd podczas wysyłania wiadomości. Spróbuj ponownie."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (message: string) => {
    sendMessage(message);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  return (
    <ChatAiContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
        messages,
      }}
    >
      {children}
    </ChatAiContext.Provider>
  );
};
