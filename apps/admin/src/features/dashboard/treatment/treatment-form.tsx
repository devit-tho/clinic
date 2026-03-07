import FormProvider, { RHFSelect, RHFTextField } from "@/components/hook-form";
import { Tooth } from "@/components/tooth";
import { useOptions } from "@/hooks/use-options";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import { getAllTeeth } from "@/utils/tooth";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Treatment, TreatmentCoverage } from "@repo/entities";
import {
  CreateOrUpdateTreatmentSchema,
  CreateOrUpdateTreatmentType,
} from "@repo/schemas";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
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

  const treatmentCoverages = useOptions("treatment-coverage");

  const editMode = !isEmpty(initialValues);

  const defaultValues: CreateOrUpdateTreatmentType = {
    type: initialValues?.type || "",
    price: initialValues?.price || 0,
    teeth: initialValues?.teeth || [],
    coverage: initialValues?.coverage || TreatmentCoverage.NONE,
  };

  const methods = useForm<CreateOrUpdateTreatmentType>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(CreateOrUpdateTreatmentSchema),
  });

  const { handleSubmit, reset, watch, setValue } = methods;

  const value = watch();

  useEffect(() => {
    const teethAllowed = getAllTeeth();

    if (value.coverage === TreatmentCoverage.FULL) {
      setValue("teeth", teethAllowed);
    } else if (
      value.coverage === TreatmentCoverage.NONE ||
      value.coverage === TreatmentCoverage.PARTIAL
    ) {
      setValue("teeth", []);
    }
  }, [value.coverage]);

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
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
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
            endContent={<>$</>}
          />

          <RHFSelect
            name="coverage"
            label={t("coverage")}
            items={treatmentCoverages}
          />

          <div className="col-span-full">
            <Tooth
              tooth={value.teeth}
              coverage={value.coverage}
              onChangePosition={(v) => {
                setValue("teeth", v.tooth);
              }}
            />
          </div>
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
