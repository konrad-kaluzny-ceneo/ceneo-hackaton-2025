import { cn } from "@/lib/utils";

export default function MaxWidthWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("max-w-4xl mx-auto px-2.5", className)}>{children}</div>;
}
