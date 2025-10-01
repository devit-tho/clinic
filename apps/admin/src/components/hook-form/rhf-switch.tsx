import { Switch, SwitchProps } from "@heroui/switch";
import { PropsWithChildren } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface RHFSwtichProps extends SwitchProps {
  name: string;
}

function RHFSwitch({
  name,
  children,
  ...other
}: PropsWithChildren<RHFSwtichProps>) {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch
            isSelected={field.value}
            onValueChange={(v) => field.onChange(v)}
            {...other}
          >
            {children}
          </Switch>
        )}
      />
    </>
  );
}

export default RHFSwitch;
