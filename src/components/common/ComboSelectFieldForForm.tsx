import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

type SelectFieldForFormItemType = {
  value: string;
  label: string;
};

type SelectFieldForFormProp = {
  label: string;
  placeholder: string;
  field: any;
  items: SelectFieldForFormItemType[];
  form: any;
  emptyBox: string;
  name: string;
  selectText: string;
  onChange?: (value: string) => void;
  getRelatedOptions?: any;
  willRelated?: boolean;
  setRelatedOptions?: any;
  disabled?: boolean; // Add the disabled prop
};

export default function ComboSelectFieldForForm({
  label,
  placeholder,
  field,
  items,
  form,
  emptyBox,
  name,
  selectText,
  onChange,
  getRelatedOptions,
  willRelated = false,
  setRelatedOptions,
  disabled = false, // Add the disabled prop
}: SelectFieldForFormProp) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Search
  const fuse = new Fuse(items, {
    keys: ["label"],
    threshold: 0.3,
  });
  const result = fuse.search(query);
  const formattedResult = query ? result.map((result) => result.item) : items;

  const handleSearch = (e: any) => {
    setQuery(e.target.value);
  };

  return (
    <FormItem className="flex flex-col grow">
      <FormLabel className="h-[19px] mt-[5px] flex items-center">
        {label}
      </FormLabel>
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              aria-expanded={open}
              className={cn(
                "justify-between h-10",
                !field.value && "text-muted-foreground"
              )}
              disabled={disabled} // Add the disabled prop here
            >
              {field.value
                ? items.find((item) => item.value === field.value)?.label
                : selectText}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2">
            <div className="flex flex-col">
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder={placeholder}
                  className="h-11 w-full rounded-md bg-transparent px-1 text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                  onChange={handleSearch}
                  value={query}
                  disabled={disabled} // Add the disabled prop here
                />
              </div>
              <Separator />
              <ScrollArea className="py-1 h-40">
                {formattedResult.length > 0 ? (
                  formattedResult.map((item) => (
                    <li
                      key={item.value} // Add a unique key here
                      onClick={() => {
                        if (disabled) return; // Prevent action if disabled
                        form.setValue(name, item.value);
                        field.onChange(item.value); // Ensure field.onChange is called
                        if (onChange) onChange(item.value);
                        if (willRelated) {
                          getRelatedOptions(setRelatedOptions, item.value);
                        }
                        setOpen(false);
                      }}
                      className={cn(
                        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        disabled && "cursor-not-allowed opacity-50" // Add styles for disabled state
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 opacity-100",
                          field.value !== item.value && "opacity-0"
                        )}
                      />
                      {item.label}
                    </li>
                  ))
                ) : (
                  <p className="py-6 text-center text-sm">{emptyBox}</p>
                )}
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
