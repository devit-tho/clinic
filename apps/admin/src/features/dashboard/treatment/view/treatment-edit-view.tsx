import { updateTreatment, useTreatment } from "@/api/treatment";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { useLocales } from "@/locales";
import paths from "@/routes/paths";
import { CreateOrUpdateTreatmentType } from "@repo/schemas";
import TreatmentForm from "../treatment-form";

// ----------------------------------------------------------------------

interface TreatmentEditProp {
  id: string;
}

// ----------------------------------------------------------------------

const TreatmentEditView: React.FC<TreatmentEditProp> = ({ id }) => {
  const { t } = useLocales();

  const { treatmentData } = useTreatment(id);

  const title = `${treatmentData?.type} - ${t("page_title.treatment.edit")}`;

  async function onSubmit(v: CreateOrUpdateTreatmentType) {
    await updateTreatment(id, v);
  }

  return (
    <>
      <title>{title}</title>

      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <CustomBreadcrumbs
          heading={t("treatment_form.edit_title")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("treatment"), href: paths.dashboard.treatment.root },
            { name: treatmentData?.type },
            { name: t("action.edit") },
          ]}
        />

        <TreatmentForm initialValues={treatmentData} onSubmit={onSubmit} />
      </div>
    </>
  );
};

export default TreatmentEditView;
