import { IRepository } from "../IRepository";

export interface AnswerRequest {
  userId: string;
  items: {
    question: string;
    answer: string;
  }[];
}

export class AnswerHandler {
  constructor(private repository: IRepository) {}

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
