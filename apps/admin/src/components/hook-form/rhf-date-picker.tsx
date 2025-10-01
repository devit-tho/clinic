import { DatePicker, DatePickerProps } from "@heroui/date-picker";
import { DateValue } from "@heroui/react";
import {
  fromDate,
  getLocalTimeZone,
  ZonedDateTime,
} from "@internationalized/date";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

interface RHFDatePickerProps extends DatePickerProps {
  name: string;
}

// ----------------------------------------------------------------------

const RHFDatePicker: React.FC<RHFDatePickerProps> = ({ name, ...other }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          fullWidth
          value={
            field.value instanceof Date
              ? fromDate(field.value, getLocalTimeZone())
              : null
          }
          onChange={(v: DateValue | null) => {
            if (!v) return;
            field.onChange((v as ZonedDateTime).toDate());
          }}
          isInvalid={!!error}
          errorMessage={error?.message}
          {...other}
        />
      )}
    />
  );
};

export default RHFDatePicker;
