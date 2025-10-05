import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Typ podróży
            <ChevronDownIcon className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuLabel>Typ aktywności</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>🧘 Relaks</DropdownMenuItem>
            <DropdownMenuItem>🏛️ Kultura</DropdownMenuItem>
            <DropdownMenuItem>⚽ Sport</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Budżet
            <ChevronDownIcon className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuLabel>Zakres cenowy</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>💰 Ekonomiczny</DropdownMenuItem>
            <DropdownMenuItem>💳 Standard</DropdownMenuItem>
            <DropdownMenuItem>💎 Premium</DropdownMenuItem>
            <DropdownMenuItem>👑 Luksus</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Czas trwania
            <ChevronDownIcon className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuLabel>Długość wyjazdu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>🌙 Krótki weekend</DropdownMenuItem>
            <DropdownMenuItem>📅 Tydzień</DropdownMenuItem>
            <DropdownMenuItem>🗓️ Dwa tygodnie</DropdownMenuItem>
            <DropdownMenuItem>🌍 Długa podróż</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
