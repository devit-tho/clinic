import {
  FieldValues,
  FormProvider as Form,
  UseFormReturn,
} from "react-hook-form";

// ----------------------------------------------------------------------

interface ProviderProp<TFieldValues extends FieldValues> {
  children: React.ReactNode;
  onSubmit: () => Promise<void>;
  methods: UseFormReturn<TFieldValues>;
}

export default function FormProvider<TFieldValues extends FieldValues>({
  children,
  onSubmit,
  methods,
}: ProviderProp<TFieldValues>) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} className="h-full" noValidate>
        {children}
      </form>
    </Form>
  );
}
