import { ContextItem } from "@/types/context-item";

export interface TripProposition {
  id: string;
  userId: string;
  taskId: string;
  data: any;
  createdAt: Date;
}

export class Repository {
  private data: ContextItem[] = [];
  private tripPropositions: TripProposition[] = [];

  public addContextItem(item: ContextItem): void {
    this.data.push(item);
  }

  public getContextItems(userId: string): ContextItem[] {
    return this.data.filter(item => item.userId === userId);
  }

  public addTripProposition(proposition: TripProposition): void {
    this.tripPropositions.push(proposition);
  }

  public getTripPropositionByTaskId(taskId: string): TripProposition | undefined {
    return this.tripPropositions.find(tp => tp.taskId === taskId);
  }

  public getTripPropositionsByUserId(userId: string): TripProposition[] {
    return this.tripPropositions.filter(tp => tp.userId === userId).map(x => x.data);
  }

  public getTripPropositionById(id: string): TripProposition | undefined {
    return this.tripPropositions.find(tp => tp.id === id);
  }

  public getAllTripPropositions(): TripProposition[] {
    return this.tripPropositions;
  }
}