import { PatientInvoiceEditView } from '@/features/dashboard/patient/view';
import { useParams } from '@/routes/hooks';

// ----------------------------------------------------------------------

export default function PatientInvoiceEditPage() {
  const param = useParams();
  const { id, invoiceId } = param;

  return (
    <>
      <PatientInvoiceEditView
        patientId={id as string}
        invoiceId={invoiceId as string}
      />
    </>
  );
}
