import { PatientInvoiceCreateView } from "@/features/dashboard/patient/view";
import { useParams } from "@/routes/hooks";

// ----------------------------------------------------------------------

export default function PatientInvoiceCreate() {
  const params = useParams();

  const id = params.id as string;

  return (
    <>
      <PatientInvoiceCreateView id={id} />
    </>
  );
}
