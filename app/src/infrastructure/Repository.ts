import { ContextItem } from "@/types/context-item";

export class Repository {
  private data: ContextItem[] = [];

  public addContextItem(item: ContextItem): void {
    this.data.push(item);
  }

  public getContextItems(userId: string): ContextItem[] {
    return this.data.filter(item => item.userId === userId);
  }
}