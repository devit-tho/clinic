import { RHFTextField } from "@/components/hook-form";
import RHFSelect from "@/components/hook-form/rhf-select";
import { useLocales } from "@/locales";
import { genders, Item } from "@/utils/default-item";
import lowerCase from "lodash/lowerCase";

// ----------------------------------------------------------------------

interface PatientFormFieldProp {
  appendPatient?: boolean;
}

// ----------------------------------------------------------------------

const PatientFormField: React.FC<PatientFormFieldProp> = ({
  appendPatient = false,
}) => {
  const { t } = useLocales();

  const genderOptions = genders.map<Item>((gender) => ({
    label: t(lowerCase(gender.label)),
    key: gender.key,
  }));

  const fieldName = {
    name: appendPatient ? "patient.name" : "name",
    age: appendPatient ? "patient.age" : "age",
    phoneNumber: appendPatient ? "patient.phoneNumber" : "phoneNumber",
    gender: appendPatient ? "patient.gender" : "gender",
  };

  return (
    <>
      <RHFTextField
        name={fieldName.name}
        label={t("patient")}
        placeholder={t("patient_form.patient_placeholder")}
        autoComplete="off"
        isClearable={!appendPatient}
        isRequired
        isDisabled={appendPatient}
      />

      <RHFTextField
        name={fieldName.age}
        type="number"
        label={t("age")}
        placeholder={t("patient_form.age_placeholder")}
        isClearable={!appendPatient}
        isRequired
        isDisabled={appendPatient}
      />

      <RHFTextField
        name={fieldName.phoneNumber}
        label={t("phone_number")}
        placeholder={t("patient_form.phone_number_placeholder")}
        autoComplete="off"
        isClearable={!appendPatient}
        isRequired
        isDisabled={appendPatient}
      />

      <RHFSelect
        name={fieldName.gender}
        label={t("gender")}
        placeholder={t("patient_form.gender_placeholder")}
        items={genderOptions}
        isRequired
        isDisabled={appendPatient}
      />
    </>
  );
};

export default PatientFormField;
