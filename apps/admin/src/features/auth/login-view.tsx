import { useAuth } from "@/auth/hooks";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import { ShowHideBtn } from "@/components/show-hide-btn";
import { useLocales } from "@/locales";
import { useRouter, useSearchParams } from "@/routes/hooks";
import paths from "@/routes/paths";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Image } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginType } from "@repo/schemas";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBoolean } from "usehooks-ts";

type LoginWithoutDevice = Omit<LoginType, "device">;

// ----------------------------------------------------------------------

const LoginView: React.FC = () => {
  const { t } = useLocales();

  const { login } = useAuth();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  const showPassword = useBoolean();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get("returnTo");

  const title = t("page_title.auth.login");

  const methods = useForm<LoginWithoutDevice>({
    defaultValues: {
      username: "D0001",
      password: "admin123",
    },
    resolver: zodResolver(
      LoginSchema.omit({
        device: true,
      })
    ),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data: LoginWithoutDevice) => {
    try {
      await login(data.username, data.password);

      router.push(returnTo || paths.dashboard.root);
    } catch (err) {
      const error = (err as Error).message;
      console.error(err);
      setErrorMsg(error);
      reset();
    }
  });

  return (
    <>
      <title>{title}</title>

      <div className="max-w-lg mx-auto lg:max-w-sm">
        <Image
          src="/images/dental-logo.png"
          alt="Dentist logo"
          className="size-36"
          classNames={{ wrapper: "justify-self-center" }}
        />

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="flex flex-col gap-y-3">
            {!!errorMsg && <Alert title={errorMsg} color="danger" />}

            <div className="flex flex-col gap-y-2">
              <RHFTextField
                name="username"
                label={t("username")}
                placeholder="Enter your username"
                autoComplete="off"
              />

              <RHFTextField
                name="password"
                label={t("password")}
                type={showPassword.value ? "text" : "password"}
                endContent={
                  <ShowHideBtn
                    onClick={showPassword.toggle}
                    show={showPassword.value}
                  />
                }
                placeholder="Enter your password"
              />
            </div>

            <Button
              isLoading={isSubmitting}
              type="submit"
              color="primary"
              fullWidth
            >
              {t("login")}
            </Button>
          </div>
        </FormProvider>
      </div>
    </>
  );
};

export default LoginView;
