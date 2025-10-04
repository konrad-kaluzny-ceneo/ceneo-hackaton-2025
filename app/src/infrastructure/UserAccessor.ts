import { NextRequest } from "next/server";

export function useUserId(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    throw new Error("Missing userId");
  }
  return userId;
}
