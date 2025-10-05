"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Question } from "@/types/question";
import { Textarea } from "@/components/ui/textarea";

const questions: Question[] = require("@/local-data/questions.json");

export default function QuestionnairePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: answer,
    }));
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setIsLoading(true);
      await fetch(`/api/context`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: Object.entries(selectedAnswers).map((item) => {
            const question = questions.find((q) => q.id === Number(item[0]));
            return {
              question: question?.text || "",
              answer: item[1],
            };
          }),
        }),
      });
      redirect(`/generating-trips`);
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: e.target.value,
    }));
  };

  const isAnswerSelected = selectedAnswers[questions[currentQuestion].id] !== undefined;

  const newLocal = "w-full flex flex-col gap-8 max-w-2xl";
  return (
    <div className="flex justify-center items-center p-4 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#3D5A4C] mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Przetwarzam Twoje odpowiedzi</h3>
            <p className="text-sm text-gray-600">Analizuję Twoje preferencje, żeby przygotować idealne propozycje...</p>
          </div>
        </div>
      )}

      <div className={newLocal}>
        {/* Nagłówek */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <Image src={questions[currentQuestion].image} alt="Question" width={200} height={200} />
          <h1 className="text-2xl font-semibold text-gray-900">Znajdź wyjątkowe propozycje</h1>
          <p className="text-sm text-gray-600">Odpowiedz na kilka pytań, aby spersonalizować swoje doświadczenie i otrzymać rekomendacje dopasowane do Twoich potrzeb.</p>
        </div>

        {/* Licznik pytań */}
        <div className="text-start flex flex-col items-start gap-2">
          <Progress value={((currentQuestion + 1) / questions.length) * 100} />
          <p className="text-sm text-gray-600">
            Pytanie {currentQuestion + 1} z {questions.length}
          </p>
        </div>

        {/* Pytanie */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-medium text-gray-900">{questions[currentQuestion].text}</h2>

          {questions[currentQuestion].type === "radio" && (
            <>
              {/* Odpowiedzi jako chipy */}
              <div className="grid grid-cols-2 justify-center gap-3 mt-6 items-center">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <Badge
                    key={index}
                    variant={selectedAnswers[questions[currentQuestion].id] === answer ? "default" : "outline"}
                    className={`
                py-3 px-6 cursor-pointer text-base font-normal justify-center w-full
                transition-all duration-200 hover:shadow-md
                ${selectedAnswers[questions[currentQuestion].id] === answer ? "bg-primary text-white hover:bg-primary" : "bg-white text-gray-700 border-gray-300 hover:border-[#3D5A4C] hover:bg-gray-50"}
              `}
                    onClick={() => {
                      handleAnswerSelect(answer);
                      handleNext();
                    }}
                  >
                    {answer}
                  </Badge>
                ))}
              </div>
            </>
          )}

          {questions[currentQuestion].type === "text" && (
            <>
              {/* Odpowiedzi jako chipy */}
              <div className="flex flex-col gap-3 mt-6 items-center">
                <Textarea
                  value={selectedAnswers[questions[currentQuestion].id]}
                  className="w-full bg-white text-sm"
                  onChange={handleTextInputChange}
                  placeholder={questions[currentQuestion].description || "Wpisz swoją odpowiedź"}
                />
                {/* Przycisk dalej */}
                <Button onClick={handleNext} disabled={!isAnswerSelected || isLoading}>
                  {currentQuestion < questions.length - 1 ? "Dalej" : "Zakończ"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
