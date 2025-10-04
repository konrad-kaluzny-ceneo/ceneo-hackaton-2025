import { ContextItem } from "./ContextItem";
import { IRepository } from "../IRepository";

export class GetUserAnswersHandler {
  constructor(private repository: IRepository) {}

  public async handle(userId: string): Promise<ContextItem[]> {
    return this.repository.getContextItems(userId);
  }
}
