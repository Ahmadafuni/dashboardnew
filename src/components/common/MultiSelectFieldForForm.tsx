import { useState } from "react";
import { FormControl, FormItem, FormLabel } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

type SelectFieldForFormItemType = {
  value: string;
  label: string;
};
type MultiSelectFieldForForm = {
  label: string;
  items: SelectFieldForFormItemType[];
  form: any;
  name: string;
  selectText: string;
  field: any;
};
export default function MultiSelectFieldForForm({
  label,
  items,
  form,
  name,
  selectText,
  field,
}: MultiSelectFieldForForm) {
  const [open, setOpen] = useState(false);
  // Handle Select
  const handleSelect = (item: any) => {
    // @ts-expect-error
    if (!field.value.some((e) => e.value === item.value)) {
      form.setValue(name, [...field.value, item]);
      return;
    }
    const tempList = field.value.filter((e: any) => {
      return e.value !== item.value;
    });
    form.setValue(name, tempList);
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
                "justify-between h-10 w-full",
                !field.value.length && "text-muted-foreground"
              )}
            >
              {field.value.length > 0
                ? // @ts-expect-error
                  field.value.map((e) => e.label).join(", ")
                : selectText}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2">
            <div className="flex flex-col">
              <ScrollArea className="py-1 h-40">
                {items.length > 0 ? (
                  items.map((item) => (
                    <li
                      onClick={() => handleSelect(item)}
                      key={item.value}
                      className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 opacity-100",
                          // @ts-expect-error
                          !field.value.some((e) => e.value === item.value) &&
                            "opacity-0"
                        )}
                      />
                      {item.label}
                    </li>
                  ))
                ) : (
                  <p className="py-6 text-center text-sm">
                    {/* {emptyBox} */}
                    No results found
                  </p>
                )}
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>
      </FormControl>
    </FormItem>
  );
}
