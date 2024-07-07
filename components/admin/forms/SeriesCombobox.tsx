"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form";
import { useGetSeries, useGetSingleSeries } from "@/services/series/queries";

const SeriesCombobox = ({ field, defaultValue }: { field?: ControllerRenderProps<any>, defaultValue?: string }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<null | string>(defaultValue ?? null);

  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    setIsLoading(true)
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setIsLoading(false)
    }, 1000)

    return () => {
      clearTimeout(handler)
    }
  }, [search])

  const { data, isPending } = useGetSeries({
    search: debouncedSearch,
    limit: 5,
    sortBy: "title",
    sort: "asc"
  })

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {value ?? "Select Series..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              placeholder="Search series..."
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>{(isLoading || isPending) ? "Searching..." : "No series found"}</CommandEmpty>
              {data?.data &&
                data?.data?.length > 0 &&
                data.data.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.title}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      field?.onChange(item.id);
                      setOpen(false);
                    }}
                    disabled={false}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.title ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.title}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </>
  );
};

export default SeriesCombobox;
