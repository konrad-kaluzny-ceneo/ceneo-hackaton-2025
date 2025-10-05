import { callAI } from "@/infrastructure/AIService";
import { inject } from "@/infrastructure/DIContainer";
import { Repository as Repository } from "@/infrastructure/Repository";

export interface AnswerRequest {
  userId: string;
  items: {
    question: string;
    answer: string;
  }[];
}

export class AnswerHandler {
  private readonly repository = inject(Repository);

  public async handle(request: AnswerRequest): Promise<void> {
    for (const item of request.items) {
      this.repository.addContextItem({
        question: item.question,
        answer: item.answer,
        userId: request.userId,
        date: new Date(),
      });
    }

    const result = await callAI(
      `
      Describe ideal location and hotel for user.
      Description should not contain concrete names of locations or hotels.
      Description should be concise (max 100 words).
      Use the following information:
      ${request.items
        .map((item) => `Question: ${item.question}, Answer: ${item.answer}`)
        .join("\n")}
      `
    );

    console.log(result);

    this.repository.addContextItem({
      question: "Summary",
      answer: result,
      userId: request.userId,
      date: new Date(),
    });
  }
}
