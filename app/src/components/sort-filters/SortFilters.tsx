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
      <div className="flex gap-3 pt-1" role="status" aria-label="Ładowanie filtrów">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
    );
  }

  return (
    <div className="flex gap-3" role="group" aria-label="Filtry sortowania">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Wybierz typ podróży">
            Typ podróży
            <ChevronDownIcon className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuLabel>Typ aktywności</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem aria-label="Filtr: Relaks">🧘 Relaks</DropdownMenuItem>
            <DropdownMenuItem aria-label="Filtr: Kultura">🏛️ Kultura</DropdownMenuItem>
            <DropdownMenuItem aria-label="Filtr: Sport">⚽ Sport</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Wybierz budżet">
            Budżet
            <ChevronDownIcon className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuLabel>Zakres cenowy</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem aria-label="Filtr: Ekonomiczny">💰 Ekonomiczny</DropdownMenuItem>
            <DropdownMenuItem aria-label="Filtr: Standard">💳 Standard</DropdownMenuItem>
            <DropdownMenuItem aria-label="Filtr: Premium">💎 Premium</DropdownMenuItem>
            <DropdownMenuItem aria-label="Filtr: Luksus">👑 Luksus</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Wybierz czas trwania">
            Czas trwania
            <ChevronDownIcon className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuLabel>Długość wyjazdu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem aria-label="Filtr: Krótki weekend">🌙 Krótki weekend</DropdownMenuItem>
            <DropdownMenuItem aria-label="Filtr: Tydzień">📅 Tydzień</DropdownMenuItem>
            <DropdownMenuItem aria-label="Filtr: Dwa tygodnie">🗓️ Dwa tygodnie</DropdownMenuItem>
            <DropdownMenuItem aria-label="Filtr: Długa podróż">🌍 Długa podróż</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
