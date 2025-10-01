import { createTreatment } from "@/api/treatment";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { useLocales } from "@/locales";
import paths from "@/routes/paths";
import { CreateOrUpdateTreatmentType } from "@repo/schemas";
import TreatmentForm from "../treatment-form";

// ----------------------------------------------------------------------

const TreatmentCreate: React.FC = () => {
  const { t } = useLocales();

  const title = t("page_title.treatment.create");

  async function onSubmit(v: CreateOrUpdateTreatmentType) {
    await createTreatment(v);
  }

  return (
    <>
      <title>{title}</title>

      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <CustomBreadcrumbs
          heading={t("treatment_form.create_title")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("treatment"), href: paths.dashboard.treatment.root },
            { name: t("action.create") },
          ]}
        />

        <TreatmentForm onSubmit={onSubmit} />
      </div>
    </>
  );
};

export default TreatmentCreate;
