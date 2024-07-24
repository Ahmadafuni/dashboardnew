import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

type SelectFieldForFormItemType = {
    value: string;
    label: string;
};

type SelectFieldForFormProp = {
    label: string;
    placeholder: string;
    field: any;
    items: SelectFieldForFormItemType[];
    onChange?: (value: string) => void;
    disabled?: boolean; // New prop for disabling the Select
};

export default function SelectFieldForForm({
                                               label,
                                               placeholder,
                                               field,
                                               items,
                                               onChange,
                                               disabled = false, // Default value for the new prop
                                           }: SelectFieldForFormProp) {
    return (
        <FormItem className="w-full">
            <FormLabel>{label}</FormLabel>
            <Select
                onValueChange={(value) => {
                    field.onChange(value);
                    if (onChange) {
                        onChange(value);
                    }
                }}
                defaultValue={field.value}
                value={field.value}
                disabled={disabled} // Use the new prop to disable the Select
            >
                <FormControl className="w-full">
                    <SelectTrigger className={cn("w-full", disabled && "opacity-50 cursor-not-allowed")}>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                    {items.map((item, idx) => (
                        <SelectItem key={idx} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
    );
}
