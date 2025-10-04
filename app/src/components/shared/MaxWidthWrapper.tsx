import { cn } from "@/lib/utils";

export default function MaxWidthWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("max-w-7xl mx-auto px-2.5", className)}>{children}</div>;
}
