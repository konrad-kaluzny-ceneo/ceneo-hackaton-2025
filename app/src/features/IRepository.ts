export interface IRepository {
  add(item: string): void;
  getAll(): string[];
}