import { NextRequest } from "next/server";

export function useUserId(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value;

  if (!userId) {
    throw new Error("Missing userId");
  }
  return userId;
}
