import { AddItemHandler } from "@/features/items/AddItemHandler";
import { IRepository } from "../features/IRepository";
import { InMemoryRepository } from "./InMemoryRepository";
import { GetItemsHandler } from "@/features/items/GetItemsHandler";

interface DIContainer {
  repository: IRepository;
  addItemHandler: AddItemHandler;
  getItemsHandler: GetItemsHandler;
}

const repo = new InMemoryRepository();


const container: DIContainer = {
  repository: repo,
  addItemHandler: new AddItemHandler(repo),
  getItemsHandler: new GetItemsHandler(repo),
};

export default container;