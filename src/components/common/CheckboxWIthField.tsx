import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "../ui/form";

const FieldWithCheckbox = ({
  name,
  label,
  control,
  fieldComponent: FieldComponent,
  fieldProps,
  isEnabled,
  onCheckedChange,
}) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      className="mt-2"
      checked={isEnabled}
      onCheckedChange={onCheckedChange}
    />
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FieldComponent
          field={field}
          {...fieldProps}
          label={label}
          disabled={!isEnabled}
        />
      )}
    />
  </div>
);

export default FieldWithCheckbox;
