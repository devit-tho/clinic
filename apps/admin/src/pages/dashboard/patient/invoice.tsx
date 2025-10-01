import { PatientInvoiceView } from '@/features/dashboard/patient/view';
import { useParams } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function PatientInvoicePage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <PatientInvoiceView id={id as string} />
    </>
  );
}
