import ExampleOfDynamicButton from "@/components/examples/ExampleOfDynamicButton";
import { Friends } from "@/components/user/Friends";
import Link from "next/link";
import { useUserId } from "@/infrastructure/UserAccessor";
import { Repository } from "@/infrastructure/Repository";
import { inject } from "@/infrastructure/DIContainer";
import { redirect } from "next/navigation";

export default async function Home() {
  const userId = await useUserId();
  console.log("userId", userId);
  const repository = inject(Repository);
  const contextItems = repository.getContextItems(userId);
  if (contextItems.length === 0) {
    return redirect("/questionnaire");
  } else {
    return redirect("/trip-propositions");
  }

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4">
      <ExampleOfDynamicButton label="Click me" />
      <Link href="/test-route">Test Route</Link>
      <Link href="/start">Start</Link>
      <Link href="/questionnaire">Questionnaire</Link>
      <Link href="/trip-propositions">Trip Propositions</Link>
      <Link href="/trip-history">Trip History</Link>
      <Friends />
    </div>
  );
}
