import { useState } from "react";
import { FormControl, FormItem } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

type SelectFieldForFormItemType = {
    value: string;
    label: string;
};

type MultiSelectFieldForFormProps = {
    items: SelectFieldForFormItemType[];
    form: any;
    name: string;
    selectText: string;
    field: any;
    onChange?: (value: string) => void;
    disabled?: boolean; // New prop for disabling the Select
};

export default function MultiSelectForField({
                                                items,
                                                form,
                                                name,
                                                selectText,
                                                field,
                                                disabled = false, // Prop from parent to disable the select
                                            }: MultiSelectFieldForFormProps) {
    const [open, setOpen] = useState(false);

    // Initialize field value if not already an array
    const selectedValues = field.value || [];

    // Handle Select
    const handleSelect = (item: SelectFieldForFormItemType) => {
        if (!selectedValues.some((e: SelectFieldForFormItemType) => e.value === item.value)) {
            form.setValue(name, [...selectedValues, item]); // Add item
        } else {
            form.setValue(
                name,
                selectedValues.filter((e: SelectFieldForFormItemType) => e.value !== item.value) // Remove item
            );
        }
    };

    return (
        <FormItem className="w-full">
            <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            aria-expanded={open}
                            className={cn("justify-between h-10 w-full",
                                !selectedValues.length && "text-muted-foreground"
                            )}
                            disabled={disabled} // Disable when prop is passed as true
                        >
                            {selectedValues.length > 0
                                ? selectedValues.map((e: any) => e.label).join(", ")
                                : selectText}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-2">
                        <ScrollArea className="py-1 h-40">
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <li
                                        key={item.value}
                                        onClick={() => handleSelect(item)}
                                        className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4 opacity-100",
                                                !selectedValues.some((e: SelectFieldForFormItemType) => e.value === item.value) &&
                                                "opacity-0"
                                            )}
                                        />
                                        {item.label}
                                    </li>
                                ))
                            ) : (
                                <p className="py-6 text-center text-sm">No results found</p>
                            )}
                        </ScrollArea>
                    </PopoverContent>
                </Popover>
            </FormControl>
        </FormItem>
    );
}
