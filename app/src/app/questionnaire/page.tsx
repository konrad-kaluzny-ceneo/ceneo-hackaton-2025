"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/infrastructure/FrontendUserAccessor";
import { redirect } from "next/navigation";

type Question = {
  id: number;
  text: string;
  answers: string[];
};

const questions: Question[] = [
  {
    id: 1,
    text: "Jak się dzisiaj czujesz?",
    answers: [
      "Szukam ciszy i spokoju",
      "Marzę o odleceniu się od dzieci",
      "Chcę kontaktu z naturą",
    ],
  },
  {
    id: 2,
    text: "Jaki jest Twój budżet na podróż?",
    answers: ["Do 2000 zł", "2000-5000 zł", "Powyżej 5000 zł"],
  },
  {
    id: 3,
    text: "Z kim planujesz podróż?",
    answers: ["Sam/Sama", "Z partnerem", "Z rodziną", "Ze znajomymi"],
  },
  {
    id: 4,
    text: "Jak długo chcesz wyjechać?",
    answers: ["Weekend (2-3 dni)", "Tydzień", "Dwa tygodnie lub więcej"],
  },
  {
    id: 5,
    text: "Jaki typ aktywności Cię interesuje?",
    answers: [
      "Relaks i odpoczynek",
      "Zwiedzanie i kultura",
      "Sport i przygoda",
      "Życie nocne",
    ],
  },
  {
    id: 6,
    text: "Jaki klimat preferujesz?",
    answers: ["Ciepło i słońce", "Umiarkowany", "Zimno i góry"],
  },
];

export default function QuestionnairePage() {
  const user = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
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
      await fetch(`/api/context?userId=${user.id}`, {
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
      redirect(`/generating-trips?userId=${user.id}`);
    }
  };

  const isAnswerSelected =
    selectedAnswers[questions[currentQuestion].id] !== undefined;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#EDE8E2] p-4">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Nagłówek */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Jak się dzisiaj czujesz?
          </h1>
          <p className="text-sm text-gray-600">
            Odpowiedz na kilka pytań, aby spersonalizować swoje doświadczenie i
            otrzymać rekomendacje dopasowane do Twoich potrzeb.
          </p>
        </div>

        {/* Licznik pytań */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Pytanie {currentQuestion + 1} z {questions.length}
          </p>
        </div>

        {/* Pytanie */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-medium text-gray-900">
            {questions[currentQuestion].text}
          </h2>

          {/* Odpowiedzi jako chipy */}
          <div className="flex flex-col gap-3 mt-6">
            {questions[currentQuestion].answers.map((answer, index) => (
              <Badge
                key={index}
                variant={
                  selectedAnswers[questions[currentQuestion].id] === answer
                    ? "default"
                    : "outline"
                }
                className={`
                  py-3 px-6 cursor-pointer text-base font-normal justify-center
                  transition-all duration-200 hover:shadow-md
                  ${
                    selectedAnswers[questions[currentQuestion].id] === answer
                      ? "bg-[#3D5A4C] text-white hover:bg-[#2D4A3C]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#3D5A4C] hover:bg-gray-50"
                  }
                `}
                onClick={() => handleAnswerSelect(answer)}
              >
                {answer}
              </Badge>
            ))}
          </div>
        </div>

        {/* Przycisk dalej */}
        <Button
          onClick={handleNext}
          disabled={!isAnswerSelected || isLoading}
          className="w-full py-6 text-base bg-[#3D5A4C] hover:bg-[#2D4A3C] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion < questions.length - 1 ? "Dalej" : "Zakończ"}
        </Button>
      </div>
    </div>
  );
}
