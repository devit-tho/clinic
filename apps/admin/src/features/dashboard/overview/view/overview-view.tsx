import { useLocales } from "@/locales";
import RecentPatient from "../recent-patient";
import WelcomeBack from "../welcome-back";

const OverviewView: React.FC = () => {
  const { t } = useLocales();

  const title = t("page_title.overview");

  return (
    <>
      <title>{title}</title>

      <div className="flex gap-2.5 size-full">
        <div className="grid grid-cols-12 grid-rows-[320px] size-full gap-8">
          <WelcomeBack />

          <RecentPatient />
        </div>
      </div>
    </>
  );
};

export default OverviewView;
