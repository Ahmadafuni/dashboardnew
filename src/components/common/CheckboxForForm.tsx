import { FormControl, FormItem, FormLabel } from "../ui/form";
import { Checkbox } from "../ui/checkbox";

type CheckboxForFormProp = {
  label: string;
  field: any;
};
export default function CheckboxForForm({ label, field }: CheckboxForFormProp) {
  return (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>{label}</FormLabel>
      </div>
    </FormItem>
  );
}
