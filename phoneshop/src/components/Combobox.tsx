'use client'

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Categories {
  categories: string[];
}

const fetchCategories = async (): Promise<Categories> => {
  const res = await fetch("https://dummyjson.com/products/category-list");
  const data = await res.json();
  return { categories: data };
};

export function Combobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const {
    data,
    error,
    isLoading,
  } = useQuery<Categories, Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return <div className="mx-auto justify-center">Loading...</div>;
  }

  if (error || !data) {
    return <div>Error: {error?.message || "Data fetch error"}</div>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-transparent border-slate-700 text-slate-700"
        >
          {value
            ? data.categories.find((category) => category === value)
            : "Kategorie"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Wyszukaj..." />
          <CommandList>
            <CommandEmpty>Nie znaleziono.</CommandEmpty>
            <CommandGroup>
              {data.categories.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
