import { UserPermissionView } from '@/features/dashboard/user/view';
import { useParams } from '@/routes/hooks';

// ----------------------------------------------------------------------

export default function UserPermissionPage() {
  const param = useParams();

  const { id } = param;

  return (
    <>
      <UserPermissionView id={id as string} />
    </>
  );
}
