import { Input, InputProps } from "@heroui/input";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

interface RHFTextFieldProps extends InputProps {
  name: string;
  showZero?: boolean;
}

// ----------------------------------------------------------------------

const RHFTextField: React.FC<RHFTextFieldProps> = ({
  name,
  type,
  showZero = false,
  ...other
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input
          {...field}
          fullWidth
          type={type === "number" ? "number" : type}
          value={
            !showZero && type === "number" && field.value === 0
              ? ""
              : field.value
          }
          onChange={(event) => {
            if (type === "number") {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          isInvalid={!!error}
          errorMessage={error?.message}
          {...other}
        />
      )}
    />
  );
};

export default RHFTextField;
