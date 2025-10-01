import { TreatmentEditView } from '@/features/dashboard/treatment/view';
import { useParams } from '@/routes/hooks';

// ----------------------------------------------------------------------

export default function TreatmentEditPage() {
  const param = useParams();
  const { id } = param;

  return (
    <>
      <TreatmentEditView id={id as string} />
    </>
  );
}
