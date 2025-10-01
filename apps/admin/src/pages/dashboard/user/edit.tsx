import { UserEditView } from '@/features/dashboard/user/view';
import { useParams } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const param = useParams();

  const { id } = param;

  return (
    <>
      <UserEditView id={id as string} />
    </>
  );
}
