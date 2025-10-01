import FormProvider, { RHFTextField } from "@/components/hook-form";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Treatment } from "@repo/entities";
import {
  CreateOrUpdateTreatmentSchema,
  CreateOrUpdateTreatmentType,
} from "@repo/schemas";
import isEmpty from "lodash/isEmpty";
import { useForm } from "react-hook-form";

interface FormProps<InitialValue, SubmitType> {
  initialValues?: InitialValue;
  onSubmit: (v: SubmitType) => Promise<void>;
}

const TreatmentForm: React.FC<
  FormProps<Treatment, CreateOrUpdateTreatmentType>
> = ({ initialValues, onSubmit }) => {
  const { t } = useLocales();

  const router = useRouter();

  const editMode = !isEmpty(initialValues);

  const defaultValues: CreateOrUpdateTreatmentType = {
    type: initialValues?.type || "",
    price: initialValues?.price || 0,
  };

  const methods = useForm<CreateOrUpdateTreatmentType>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(CreateOrUpdateTreatmentSchema),
  });

  const { handleSubmit, reset } = methods;

  const submit = handleSubmit(async (v: CreateOrUpdateTreatmentType) => {
    try {
      const message = editMode
        ? "treatment_form.edited"
        : "treatment_form.created";

      await onSubmit(v);

      addToast({
        description: t(message),
        color: "success",
      });

      router.back();
    } catch (error) {
      console.error(error);
      reset();
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={submit}>
      <div className="flex flex-col gap-y-2.5">
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
          <RHFTextField
            name="type"
            label={t("type")}
            placeholder={t("treatment_form.type_placeholder")}
            isClearable
            isRequired
          />

          <RHFTextField
            name="price"
            type="number"
            label={t("price")}
            placeholder={t("treatment_form.price_placeholder")}
            isClearable
            isRequired
          />
        </div>

        <div className="flex justify-end gap-x-2.5">
          <Button type="submit" color="primary">
            {t(editMode ? "action.edit" : "add")}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default TreatmentForm;
