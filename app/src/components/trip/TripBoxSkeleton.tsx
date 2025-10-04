import { Skeleton } from "../ui/skeleton";

export default function TripBoxSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col gap-4">
      <Skeleton className="w-full h-42 rounded-t-2xl" />
      <div className="px-6 flex-1 pb-4 flex flex-col gap-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
}
