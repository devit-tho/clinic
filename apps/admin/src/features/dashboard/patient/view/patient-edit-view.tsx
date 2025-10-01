import { updatePatient, usePatient } from "@/api/patient";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { LoadingScreen } from "@/components/loading";
import { useLocales } from "@/locales";
import paths from "@/routes/paths";
import { CreateOrUpdatePatientType } from "@repo/schemas";
import PatientForm from "../patient-form";

// ----------------------------------------------------------------------

interface PatientEditProp {
  id: string;
}

// ----------------------------------------------------------------------

const PatientEditView: React.FC<PatientEditProp> = ({ id }) => {
  const { patientData, patientLoading } = usePatient(id);

  const { t } = useLocales();

  const title = `${patientData?.name} - ${t("page_title.patient.edit")}`;

  async function onSubmit(v: CreateOrUpdatePatientType) {
    await updatePatient(id, v);
  }

  if (patientLoading && !patientData) return <LoadingScreen />;

  return (
    <>
      <title>{title}</title>

      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <CustomBreadcrumbs
          heading={t("patient_form.edit_title")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("patient"), href: paths.dashboard.patient.root },
            { name: patientData?.name },
            { name: t("action.edit") },
          ]}
        />

        <PatientForm initialValues={patientData} onSubmit={onSubmit} />
      </div>
    </>
  );
};

export default PatientEditView;
