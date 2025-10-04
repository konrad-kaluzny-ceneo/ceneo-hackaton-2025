import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface SortFiltersProps {
  isLoading?: boolean;
}

export default function SortFilters({ isLoading = false }: SortFiltersProps) {
  if (isLoading) {
    return (
      <div className="flex gap-3 pt-1">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Button>
        Spokój
        <ChevronDownIcon className="w-4 h-4" />
      </Button>
      <Button>
        Tryb natury
        <ChevronDownIcon className="w-4 h-4" />
      </Button>
      <Button>
        Filtry
        <ChevronDownIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
