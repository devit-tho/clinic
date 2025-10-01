// ----------------------------------------------------------------------

import { usePatient } from "@/api";
import { useInvoice, useInvoiceNo } from "@/api/invoice";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { LoadingScreen } from "@/components/loading";
import { useLocales } from "@/locales";
import paths from "@/routes/paths";
import { Status } from "@repo/entities";
import { CreateOrUpdateInvoiceDetailType } from "@repo/schemas";
import omit from "lodash/omit";
import PatientInvoiceForm from "../patient-invoice-form";

interface PatientInvoiceEditProp {
  patientId: string;
  invoiceId: string;
}

// ----------------------------------------------------------------------

const PatientInvoiceEditView: React.FC<PatientInvoiceEditProp> = ({
  patientId,
  invoiceId,
}) => {
  const { t } = useLocales();

  const { patientData, patientLoading } = usePatient(patientId);
  const { invoiceData, invoiceLoading } = useInvoice(invoiceId);

  const { invoiceNoData, invoiceNoEmpty, invoiceNoLoading } = useInvoiceNo();

  const title = `${patientData?.name} - ${t("page_title.patient.invoice_edit")}`;

  const onSubmit = async (v: CreateOrUpdateInvoiceDetailType) => {
    console.log(v);
  };

  const initialValues: CreateOrUpdateInvoiceDetailType = {
    invoice: {
      discount: invoiceData?.payment.discount || 0,
      total: invoiceData?.payment.total || 0,
      newDeposit: 0,
      status: invoiceData?.status || Status.PENDING,
      deposit: invoiceData?.payment.deposit || 0,
      patientId: patientId,
    },
    details: invoiceData?.details || [],
  };

  const loading = patientLoading || invoiceLoading || invoiceNoLoading;

  if (loading) {
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
          heading={t("patient_invoice.edit")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("patient"), href: paths.dashboard.patient.root },
            { name: patientData?.name },
            {
              name: t("Invoice"),
              href: paths.dashboard.patient.invoice(patientId),
            },
            ...(invoiceNoEmpty ? [{ name: invoiceNoData }] : []),
          ]}
        />

        <PatientInvoiceForm
          patient={omit(patientData, ["invoices"])}
          initialValues={initialValues}
          onSubmit={onSubmit}
          patientId={patientId}
          invNo={invoiceNoData as string}
        />
      </div>
    </>
  );
};

export default PatientInvoiceEditView;
