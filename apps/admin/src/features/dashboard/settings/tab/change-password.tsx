import { changePassword } from "@/api";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import { ShowHideBtn } from "@/components/show-hide-btn";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { changePasswordDefaultValues } from "@/utils/initial-value";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema, ChangePasswordType } from "@repo/schemas";
import { useForm } from "react-hook-form";
import { useToggle } from "usehooks-ts";

// ----------------------------------------------------------------------

const ChangePassword: React.FC = () => {
  const { t } = useLocales();

  const router = useRouter();

  const [currentPassword, toggleCurrentPassword] = useToggle();
  const [newPassword, toggleNewPassword] = useToggle();
  const [confirmPassword, toggleConfirmPassword] = useToggle();

  const methods = useForm<ChangePasswordType>({
    defaultValues: changePasswordDefaultValues,
    resolver: zodResolver(ChangePasswordSchema),
  });

  const { handleSubmit, reset } = methods;

  const title = t("page_title.settings.change_password");

  const onSubmit = handleSubmit(async (v: ChangePasswordType) => {
    try {
      await changePassword(v);
      addToast({
        description: t("settings_form.changed_password"),
        color: "success",
      });
      router.push(paths.dashboard.root);
    } catch (err) {
      console.error(err);
      reset();
    }
  });

  return (
    <>
      <title>{title}</title>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <div className="flex flex-col gap-y-4">
          <RHFTextField
            name="currentPassword"
            type={currentPassword ? "text" : "password"}
            label={t("settings_form.current_password")}
            placeholder={t("settings_form.current_password_placeholder")}
            endContent={
              <ShowHideBtn
                onClick={toggleCurrentPassword}
                show={currentPassword}
              />
            }
          />

          <RHFTextField
            name="newPassword"
            type={newPassword ? "text" : "password"}
            label={t("settings_form.new_password")}
            placeholder={t("settings_form.new_password_placeholder")}
            endContent={
              <ShowHideBtn onClick={toggleNewPassword} show={newPassword} />
            }
          />

          <RHFTextField
            name="confirmPassword"
            type={confirmPassword ? "text" : "password"}
            label={t("settings_form.confirm_password")}
            placeholder={t("settings_form.confirm_password_placeholder")}
            endContent={
              <ShowHideBtn
                onClick={toggleConfirmPassword}
                show={confirmPassword}
              />
            }
          />

          <div className="flex justify-end">
            <Button type="submit" color="primary">
              {t("change")}
            </Button>
          </div>
        </div>
      </FormProvider>
    </>
  );
};

export default ChangePassword;
