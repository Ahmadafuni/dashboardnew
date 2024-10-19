import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type TextInputFieldForFormProp = {
    label: string;
    placeholder: string;
    field: any;
    type?: "text" | "password" | "file" | "number" | "date";
    rows?: number; // Optional prop for textarea rows
};

export default function TextInputFieldForForm({
                                                  label,
                                                  placeholder,
                                                  field,
                                                  type = "text",
                                                  rows,
                                              }: TextInputFieldForFormProp) {
    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                {rows ? (
                    <textarea
                        placeholder={placeholder}
                        {...field}
                        rows={rows} // Dynamic row rendering
                        className="form-textarea w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                ) : (
                    <Input placeholder={placeholder} {...field} type={type} />
                )}
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}
