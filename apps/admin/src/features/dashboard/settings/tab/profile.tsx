import { updateCurrentUser } from "@/api/user";
import { useAuth } from "@/auth/hooks";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { addToast } from "@heroui/react";
import { UserWithoutPassword } from "@repo/entities";
import { UpdateUserType } from "@repo/schemas";
import UserForm from "../../user/user-form";

const Profile: React.FC = () => {
  const { t } = useLocales();

  const router = useRouter();

  const { user } = useAuth();

  const title = t("page_title.settings.profile");

  async function onSubmit(v: UpdateUserType) {
    await updateCurrentUser(v);
    addToast({
      description: t("settings_form.updated_profile"),
      color: "success",
    });
    router.push(paths.dashboard.root);
  }

  return (
    <>
      <title>{title}</title>

      <UserForm
        settings
        initialValues={user as UserWithoutPassword}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default Profile;
