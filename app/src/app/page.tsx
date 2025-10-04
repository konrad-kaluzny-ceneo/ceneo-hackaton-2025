import ExampleOfDynamicButton from "@/components/examples/ExampleOfDynamicButton";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4">
      <ExampleOfDynamicButton label="Click me" />
      <Link href="/test-route">Test Route</Link>
      <Link href="/questionnaire">Questionnaire</Link>
      <Link href="/trip-propositions">Trip Propositions</Link>
    </div>
  );
}
