import { inject } from "@/infrastructure/DIContainer";
import { Repository } from "@/infrastructure/Repository";
import { useUserId } from "@/infrastructure/UserAccessor";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = await useUserId();
  const repository = inject(Repository);
  const isCompleted = repository.getContextItems(userId).length > 0;
  const isGenerated = repository.getTripPropositionsByUserId(userId).length > 0;

  return NextResponse.json({
    isCompleted: isCompleted,
    isGenerated: isGenerated,
  });
}
