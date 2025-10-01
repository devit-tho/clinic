import { Checkbox, CheckboxProps } from "@heroui/checkbox";
import { PropsWithChildren } from "react";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

interface RHFCheckboxProps extends PropsWithChildren<CheckboxProps> {
  name: string;
}

// ----------------------------------------------------------------------

const RHFCheckbox: React.FC<RHFCheckboxProps> = ({
  name,
  children,
  ...other
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Checkbox {...field} isSelected={field.value} {...other}>
          {children}
        </Checkbox>
      )}
    />
  );
};

export default RHFCheckbox;
