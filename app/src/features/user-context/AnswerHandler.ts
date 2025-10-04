import { IRepository } from "../IRepository";

export interface AnswerRequest {
  userId: string;
  question: string;
  answer: string;
}

export class AnswerHandler {
  constructor(private repository: IRepository) {}

  public async handle(request: AnswerRequest): Promise<void> {
    this.repository.addContextItem({
      question: request.question,
      answer: request.answer,
      userId: request.userId,
      date: new Date(),
    });
  }
}
