import { ContextItem } from "@/features/user-context/ContextItem";
import { IRepository } from "../features/IRepository";

export class InMemoryRepository implements IRepository {
  private data: ContextItem[] = [];

  public addContextItem(item: ContextItem): void {
    this.data.push(item);
  }

  public getContextItems(userId: string): ContextItem[] {
    return this.data.filter(item => item.userId === userId);
  }
}