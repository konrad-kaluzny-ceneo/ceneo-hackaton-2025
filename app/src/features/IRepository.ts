import { ContextItem } from "./user-context/ContextItem";

export interface IRepository {
  addContextItem(item: ContextItem): void
  getContextItems(userId: string): ContextItem[]
}