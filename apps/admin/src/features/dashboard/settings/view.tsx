import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { useLocales } from "@/locales";
import paths from "@/routes/paths";
import { Tab, Tabs } from "@heroui/tabs";
import { ChangePassword, Profile } from "./tab";

const SettingsView: React.FC = () => {
  const { t } = useLocales();

  const tabs = [
    { key: "profile", label: t("setting_tab.profile"), render: <Profile /> },
    {
      key: "change-password",
      label: t("setting_tab.change_password"),
      render: <ChangePassword />,
    },
  ];

  return (
    <>
      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <CustomBreadcrumbs
          heading={t("settings")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("settings") },
          ]}
        />

        <Tabs>
          {tabs.map((tab) => (
            <Tab key={tab.key} title={tab.label}>
              {tab.render}
            </Tab>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default SettingsView;
