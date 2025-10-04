import { IRepository } from "../IRepository";

export class GetItemsHandler {
  constructor(private repository: IRepository) {}
  public async handle() {
    return this.repository.getAll();
  }
}
