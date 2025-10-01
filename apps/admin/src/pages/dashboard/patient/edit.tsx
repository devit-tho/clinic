import { PatientEditView } from '@/features/dashboard/patient/view';
import { useParams } from '@/routes/hooks';

// ----------------------------------------------------------------------

export default function PatientEditPage() {
  const param = useParams();

  const { id } = param;

  return (
    <>
      <PatientEditView id={id as string} />
    </>
  );
}
