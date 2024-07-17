import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
};

export default function SelectFieldForForm({
                                             label,
                                             placeholder,
                                             field,
                                             items,
                                             onChange,
                                           }: SelectFieldForFormProp) {
  return (
      <FormItem>
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
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
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
