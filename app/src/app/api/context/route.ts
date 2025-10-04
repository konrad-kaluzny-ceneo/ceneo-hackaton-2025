import { inject } from "@/infrastructure/DIContainer";
import { AnswerHandler } from "@/features/user-context/AnswerHandler";
import { useUserId } from "@/infrastructure/UserAccessor";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const userId = useUserId(request);
  const body = await request.json();
  const answerHandler = inject(AnswerHandler);

  await answerHandler.handle({
    userId: userId,
    items: body.items,
  });

  return new Response();
}
