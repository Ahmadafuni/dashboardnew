import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

type DatePickerForFormProp = {
    label: string;
    field: any;
    isDisabled?: boolean;
    allowPastDates?: boolean;
};

export default function DatePickerForForm({
                                              label,
                                              field,
                                              isDisabled = false,
                                              allowPastDates = true,
                                          }: DatePickerForFormProp) {
    return (
        <FormItem className="flex flex-col w-full">
            <FormLabel>{label}</FormLabel>
            <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            disabled={isDisabled}
                        >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => !allowPastDates && date < new Date()}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    );
}
