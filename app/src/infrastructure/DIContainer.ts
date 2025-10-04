import { AnswerHandler } from "@/features/user-context/AnswerHandler";
import { IRepository } from "../features/IRepository";
import { InMemoryRepository } from "./InMemoryRepository";
import { GetUserAnswersHandler } from "@/features/user-context/GetUserAnswersHandler";

interface DIContainer {
  repository: IRepository;
  answerHadler: AnswerHandler;
  getUserAnswersHandler: GetUserAnswersHandler;
}

const repo = new InMemoryRepository();


const container: DIContainer = {
  repository: repo,
  answerHadler: new AnswerHandler(repo),
  getUserAnswersHandler: new GetUserAnswersHandler(repo),
};

export default container;