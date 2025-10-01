import { Item } from "@/utils/default-item";
import { Select, SelectItem, SelectProps } from "@heroui/select";
import capitalize from "lodash/capitalize";
import { Controller, useFormContext } from "react-hook-form";

interface RHFSelectProps extends Omit<SelectProps, "children"> {
  name: string;
  items: Item[];
  multiple?: boolean;
}

// ----------------------------------------------------------------------

const RHFSelect: React.FC<RHFSelectProps> = ({
  name,
  items,
  multiple = false,
  ...other
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...field}
          fullWidth
          items={items}
          selectedKeys={new Set([field.value])}
          isInvalid={!!error}
          errorMessage={error?.message}
          {...other}
        >
          {(v) => <SelectItem key={v.key}>{capitalize(v.label)}</SelectItem>}
        </Select>
      )}
    />
  );
};

export default RHFSelect;
