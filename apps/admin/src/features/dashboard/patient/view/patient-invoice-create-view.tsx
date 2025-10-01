import { createInvoiceWithDetails, useInvoiceNo } from "@/api/invoice";
import { usePatient } from "@/api/patient";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { LoadingScreen } from "@/components/loading";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { CreateOrUpdateInvoiceDetailType } from "@repo/schemas";
import omit from "lodash/omit";
import PatientInvoiceForm from "../patient-invoice-form";

// ----------------------------------------------------------------------

interface PatientInvoiceCreateProps {
  id: string;
}

// ----------------------------------------------------------------------

const PatientInvoiceCreateView: React.FC<PatientInvoiceCreateProps> = ({
  id,
}) => {
  const { patientData, patientLoading } = usePatient(id);

  const { invoiceNoData, invoiceNoEmpty, invoiceNoLoading } = useInvoiceNo();

  const { t } = useLocales();

  const router = useRouter();

  const title = `${patientData?.name} - ${t("page_title.patient.invoice_create")}`;

  async function onSubmit(v: CreateOrUpdateInvoiceDetailType) {
    await createInvoiceWithDetails(v);
    router.back();
  }

  if (patientLoading || invoiceNoLoading) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  }

  return (
    <>
      <title>{title}</title>

      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <CustomBreadcrumbs
          heading={t("patient_invoice.create")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("patient"), href: paths.dashboard.patient.root },
            { name: patientData?.name },
            {
              name: t("invoice"),
              href: paths.dashboard.patient.invoice(id),
            },
            ...(!invoiceNoEmpty ? [{ name: invoiceNoData }] : []),
          ]}
        />

        <PatientInvoiceForm
          patient={omit(patientData, ["invoices"])}
          onSubmit={onSubmit}
          patientId={id}
          invNo={invoiceNoData as string}
        />
      </div>
    </>
  );
};

export default PatientInvoiceCreateView;
