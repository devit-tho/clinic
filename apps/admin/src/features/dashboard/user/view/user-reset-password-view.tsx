import { resetPassword, useUser } from "@/api";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import LoadingData from "@/components/loading/loading-data";
import { ShowHideBtn } from "@/components/show-hide-btn";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { resetPasswordDefaultValues } from "@/utils/initial-value";
import { addToast, Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, ResetPasswordType } from "@repo/schemas";
import { useForm } from "react-hook-form";
import { useBoolean } from "usehooks-ts";

// ----------------------------------------------------------------------

interface UserResetPasswordProp {
  id: string;
}

// ----------------------------------------------------------------------

const UserResetPasswordView: React.FC<UserResetPasswordProp> = ({ id }) => {
  const { t } = useLocales();

  const router = useRouter();

  const { userData, userLoading } = useUser(id);

  const showNewPassword = useBoolean();

  const methods = useForm<Omit<ResetPasswordType, "userId">>({
    defaultValues: resetPasswordDefaultValues,
    mode: "onSubmit",
    resolver: zodResolver(ResetPasswordSchema.omit({ userId: true })),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const title = `${userData?.alias} - ${t("page_title.user.reset_password")}`;

  const onSubmit = handleSubmit(
    async (v: Omit<ResetPasswordType, "userId">) => {
      try {
        const newValue: ResetPasswordType = {
          userId: id,
          password: v.password,
        };
        await resetPassword(newValue);
        router.push(paths.dashboard.root);
        addToast({
          description: t("toast.reset_password"),
          color: "success",
        });
      } catch (error) {
        console.error(error);
        addToast({
          description: t("toast.error"),
          color: "danger",
        });
        reset();
      }
    }
  );

  if (!userData) return null;

  if (userLoading) return <LoadingData />;

  return (
    <>
      <title>{title}</title>

      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <CustomBreadcrumbs
          heading={t("reset_password")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("user"), href: paths.dashboard.user.root },
            { name: userData.alias },
            { name: t("reset_password") },
          ]}
        />

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="flex flex-col gap-y-4">
            <div className="grid grid-cols-2 gap-x-4">
              <RHFTextField
                name="password"
                label={t("settings_form.new_password")}
                placeholder="Enter your new password"
                type={showNewPassword.value ? "text" : "password"}
                endContent={
                  <ShowHideBtn
                    onClick={showNewPassword.toggle}
                    show={showNewPassword.value}
                  />
                }
              />
            </div>
          </div>
        </FormProvider>

        <div className="flex justify-end">
          <Button color="primary" type="submit" isLoading={isSubmitting}>
            {t("reset")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserResetPasswordView;
