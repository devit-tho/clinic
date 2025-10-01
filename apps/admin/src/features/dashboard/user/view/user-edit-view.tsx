import { updateUser, useUser } from "@/api/user";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { LoadingScreen } from "@/components/loading";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { UserWithoutPassword } from "@repo/entities";
import { CreateUserType, UpdateUserType } from "@repo/schemas";
import UserForm from "../user-form";

// -----

interface UserEditProp {
  id: string;
}

// ------

const UserEditView: React.FC<UserEditProp> = ({ id }) => {
  const { t } = useLocales();
  const { userData, userLoading } = useUser(id);
  const router = useRouter();

  const title = `${userData?.alias} - ${t("page_title.user.edit")}`;

  async function onSubmit(v: CreateUserType | UpdateUserType) {
    try {
      await updateUser(id, v);
      router.push(paths.dashboard.user.root);
    } catch (error) {
      console.error(error);
    }
  }

  if (userLoading) {
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
          heading={t("settings_form.edit_user")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("user"), href: paths.dashboard.user.root },
            { name: userData?.alias },
            { name: t("action.edit") },
          ]}
        />

        <UserForm
          initialValues={userData as UserWithoutPassword}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
};

export default UserEditView;
