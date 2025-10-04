import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function SortFilters() {
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
