import { createPatient } from "@/api/patient";
import CustomBreadcrumbs from "@/components/custom-breadcrumb/custom-breadcrumbs";
import { useLocales } from "@/locales";
import paths from "@/routes/paths";
import { CreateOrUpdatePatientType } from "@repo/schemas";
import PatientForm from "../patient-form";

// ----------------------------------------------------------------------

const PatientCreateView: React.FC = () => {
  const { t } = useLocales();

  const title = t("page_title.patient.create");

  async function onSubmit(v: CreateOrUpdatePatientType) {
    await createPatient(v);
  }

  return (
    <>
      <title>{title}</title>

      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <CustomBreadcrumbs
          heading={t("patient_form.create_title")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("patient"), href: paths.dashboard.patient.root },
            { name: t("action.create") },
          ]}
        />

        <PatientForm onSubmit={onSubmit} />
      </div>
    </>
  );
};

export default PatientCreateView;
