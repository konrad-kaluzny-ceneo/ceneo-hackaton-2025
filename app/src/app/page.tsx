import ExampleOfDynamicButton from "@/components/examples/ExampleOfDynamicButton";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4">
      <ExampleOfDynamicButton label="Click me" />
      <Link href="/test-route">Test Route</Link>
    </div>
  );
}
