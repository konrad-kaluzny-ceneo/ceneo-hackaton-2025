import { inject } from "@/infrastructure/DIContainer";
import { Repository } from "@/infrastructure/Repository";

export class GetUserTripsHandler {
  private readonly repository = inject(Repository);

  public async handle(userId: string) {
    return this.repository.getTripPropositionsByUserId(userId);
  }
}
