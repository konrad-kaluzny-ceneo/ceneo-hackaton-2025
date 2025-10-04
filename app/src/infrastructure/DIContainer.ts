import { AnswerHandler } from "@/features/user-context/AnswerHandler";
import { IRepository } from "../features/IRepository";
import { InMemoryRepository } from "./InMemoryRepository";

interface DIContainer {
  repository: IRepository;
  answerHadler: AnswerHandler;
}

const repo = new InMemoryRepository();


const container: DIContainer = {
  repository: repo,
  answerHadler: new AnswerHandler(repo),
};

export default container;