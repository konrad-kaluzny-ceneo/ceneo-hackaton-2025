import { IRepository } from "../features/IRepository";

export class InMemoryRepository implements IRepository {
  private data: string[] = [];
  
  add(item: string): void {
    this.data.push(item);
  }
  getAll(): string[] {
    return [...this.data];
  }
}