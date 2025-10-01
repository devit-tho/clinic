import { UserResetPasswordView } from '@/features/dashboard/user/view';
import { useParams } from '@/routes/hooks';

// ----------------------------------------------------------------------

export default function UserResetPasswordPage() {
  const param = useParams();

  const { id } = param;

  return (
    <>
      <UserResetPasswordView id={id as string} />
    </>
  );
}
