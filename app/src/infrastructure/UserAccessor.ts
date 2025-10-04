import { cookies } from "next/headers";

export async function useUserId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  console.log("userId", userId);

  if (!userId) {
    throw new Error("Missing userId");
  }
  return userId;
}
