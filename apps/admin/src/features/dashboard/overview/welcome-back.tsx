import { useAuth } from "@/auth/hooks";
import { useLocales } from "@/locales";
import { RouterLink } from "@/routes/components";
import paths from "@/routes/paths";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";

// ----------------------------------------------------------------------

const WelcomeBack: React.FC = () => {
  const { t } = useLocales();

  const { user } = useAuth();

  return (
    <>
      <Card
        radius="sm"
        shadow="sm"
        classNames={{
          base: "w-full grow col-span-8 bg-[url('/images/health-care-bg.png')] bg-no-repeat bg-cover bg-gradient-tob from-black/50",
          body: "px-10 flex-row justify-between items-center",
        }}
      >
        <CardBody>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-foreground-400/50"></div>
          <div className="flex flex-col gap-y-8 basis-96 z-20">
            <div className="flex flex-col gap-y-3">
              <h2 className="text-white text-2xl font-semibold">
                {t("overview_view.welcome_section.title")} 👋 <br />{" "}
                {user?.alias}
              </h2>

              <span className="text-sm font-medium">
                If you are going to use a passage of Lorem Ipsum, you need to be
                sure there isn't anything.
              </span>
            </div>

            <Button
              as={RouterLink}
              href={paths.dashboard.patient.root}
              className="justify-start w-max font-semibold"
              color="primary"
            >
              {t("overview_view.welcome_section.action")}
            </Button>
          </div>
          <div className="size-52 p-4">
            <Image src="/images/doctor.png" className="h-full" />
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default WelcomeBack;
