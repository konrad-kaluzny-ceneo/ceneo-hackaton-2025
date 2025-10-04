import container from "@/infrastructure/DIContainer";
import { useUserId } from "@/infrastructure/UserAccessor";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const userId = useUserId(request);
  const body = await request.json();

  await container.answerHadler.handle({
    userId: userId,
    question: body.question,
    answer: body.answer,
  });

  return new Response();
}

export async function GET(request: NextRequest) {
  const userId = useUserId(request);

  const contextItems = await container.getUserAnswersHandler.handle(userId);
  return new Response(JSON.stringify(contextItems), { status: 200 });
}