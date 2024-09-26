import { Control, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "../ui/form";

interface FieldWithCheckboxProps<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    label: string;
    control: Control<TFieldValues>;
    fieldComponent: React.ComponentType<any>;
    fieldProps?: Record<string, any>;
    isEnabled: boolean;
    onCheckedChange: (checked: boolean) => void;
}

const FieldWithCheckbox = <TFieldValues extends FieldValues>({
                                                                 name,
                                                                 label,
                                                                 control,
                                                                 fieldComponent: FieldComponent,
                                                                 fieldProps,
                                                                 isEnabled,
                                                                 onCheckedChange,
                                                             }: FieldWithCheckboxProps<TFieldValues>) => (
    <div className="flex items-center space-x-2">
        <Checkbox className="mt-0" checked={isEnabled} onCheckedChange={onCheckedChange} />
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
