import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form";
import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import React from "react";

interface CheckboxWithTextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  emptyBox: string;
  selectText: string;
  items: Array<{ value: string; label: string }>;
  control: any;
  form: any;
  isEnabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setSelected: (value: any) => void;
}

const CheckboxWithTextField: React.FC<CheckboxWithTextFieldProps> = ({
  name,
  label,
  placeholder,
  emptyBox,
  selectText,
  items,
  control,
  form,
  isEnabled,
  setEnabled,
  setSelected,
}) => {
  const handleCheckboxChange = () => {
    setEnabled((prev) => {
      if (prev) {
        form.setValue(name, "");
      }
      return !prev;
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        className="mt-8"
        checked={isEnabled}
        onCheckedChange={handleCheckboxChange}
      />
      <FormField
        name={name}
        control={control}
        render={({ field }) => (
          <ComboSelectFieldForForm
            field={field}
            label={label ?? ""}
            placeholder={placeholder ?? ""}
            emptyBox={emptyBox}
            form={form}
            name={name}
            selectText={selectText}
            items={items}
            onChange={(value) => {
              field.onChange(value);
              setSelected(value);
            }}
            disabled={!isEnabled}
          />
        )}
      />
    </div>
  );
};

export default CheckboxWithTextField;
