import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type TextInputFieldForFormProp = {
  label: string;
  placeholder: string;
  field: any;
  type?: "text" | "password" | "file" | "number" | "date";
};

export default function TextInputFieldForForm({
  label,
  placeholder,
  field,
  type = "text",
}: TextInputFieldForFormProp) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input placeholder={placeholder} {...field} type={type} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
