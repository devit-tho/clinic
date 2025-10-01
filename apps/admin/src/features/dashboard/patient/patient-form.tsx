import FormProvider from "@/components/hook-form";
import { useLocales } from "@/locales";
import { FormProps } from "@/types";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, Patient } from "@repo/entities";
import {
  CreateOrUpdatePatientSchema,
  CreateOrUpdatePatientType,
} from "@repo/schemas";
import isEmpty from "lodash/isEmpty";
import { useForm } from "react-hook-form";
import PatientFormField from "./patient-form-field";

// -----------------------------------------------------------------------------

const PatientForm: React.FC<FormProps<Patient, CreateOrUpdatePatientType>> = ({
  initialValues,
  onSubmit,
}) => {
  const { t } = useLocales();

  const editMode = !isEmpty(initialValues);

  const defaultValues: CreateOrUpdatePatientType = {
    name: initialValues?.name ?? "",
    age: initialValues?.age ?? 0,
    phoneNumber: initialValues?.phoneNumber ?? "",
    gender: initialValues?.gender ?? Gender.Male,
  };

  const methods = useForm<CreateOrUpdatePatientType>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(CreateOrUpdatePatientSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const submit = handleSubmit(async (v: CreateOrUpdatePatientType) => {
    try {
      const message = editMode ? "patient_form.edited" : "patient_form.created";

      await onSubmit(v);

      addToast({
        description: t(message),
        color: "success",
      });
    } catch (error) {
      console.error(error);
      reset();
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={submit}>
      <div className="flex flex-col gap-y-2.5">
        <div className="grid sm:grid-cols-2 gap-2.5">
          <PatientFormField />
        </div>

        <div className="flex items-center justify-end gap-x-2">
          <Button type="submit" color="primary" isLoading={isSubmitting}>
            {t(editMode ? "action.edit" : "add")}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default PatientForm;
