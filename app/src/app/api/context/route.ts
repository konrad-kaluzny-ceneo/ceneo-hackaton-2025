import container from "@/infrastructure/DIContainer";
import { useUserId } from "@/infrastructure/UserAccessor";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const userId = useUserId(request);
  const body = await request.json();

  await container.answerHadler.handle({
    userId: userId,
    items: body.items
  });

  return new Response();
}