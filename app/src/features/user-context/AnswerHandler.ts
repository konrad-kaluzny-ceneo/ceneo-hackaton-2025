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
  }
}
