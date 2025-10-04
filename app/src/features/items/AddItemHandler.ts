import { IRepository } from "../IRepository";

export class AddItemHandler {
  constructor(private repository: IRepository) {}

  public async handle(item: string) {
    this.repository.add(item);
  }
}
