import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form";
import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";

const CheckboxWithTextField = (props: any) => {
  const handleCheckboxChange = () => {
    props.setEnabled((prev: any) => {
      if (prev) {
        props.form.setValue(props.name, "");
      }
      return !prev;
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        className="mt-8"
        checked={props.isEnabled}
        onCheckedChange={handleCheckboxChange}
      />
      <FormField
        name={props.name}
        control={props.control}
        render={({ field }) => (
          <ComboSelectFieldForForm
            field={field}
            label={props.label}
            placeholder={props.placeholder}
            emptyBox={props.emptyBox}
            form={props.form}
            name={props.name}
            selectText={props.selectText}
            items={props.items}
            onChange={(value) => {
              field.onChange(value);
              props.setSelected(value);
            }}
            disabled={!props.isEnabled}
          />
        )}
      />
    </div>
  );
};

export default CheckboxWithTextField;
