"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

interface Props {
  values: { value: any; label: string }[];
  selectedValue: any;
  placeholder: string;
  onValueChange: (v: any) => void;
  disabled?: boolean;
}

export function ComboboxStatic({
  selectedValue,
  values,
  placeholder,
  onValueChange,
  disabled,
}: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground"
          disabled={disabled}
        >
          <span className="truncate">
            {values.find((v) => v.value == selectedValue)
              ? values.find((v) => v.value == selectedValue)?.label
              : `Select ${placeholder}`}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-(--radix-popper-anchor-width) p-0"
      >
        <Command>
          <CommandInput placeholder={`search ${placeholder}`} className="h-9" />
          <CommandList className="max-h-[max(calc(var(--radix-popper-available-height)-36px-40px),200px)]">
            <CommandEmpty>No {placeholder} found.</CommandEmpty>
            <CommandGroup>
              {values.map((v, i) => (
                <CommandItem
                  key={i}
                  value={v.value}
                  onSelect={(currentValue) => {
                    onValueChange(
                      currentValue == selectedValue ? undefined : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  {v.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValue == v.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
