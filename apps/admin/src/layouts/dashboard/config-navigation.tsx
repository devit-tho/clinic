import { IconifyIcon } from "@/components/iconify";
import { useLocales } from "@/locales";
// Service

import config from "@/config";
import paths from "@/routes/paths";
import { INVOICE, PATIENT, TREATMENT } from "@/utils/permission-data";

// ----------------------------------------------------------------

export interface List {
  path: string;
  title: string;
  icon?: React.ReactNode | string | IconifyIcon;
  roles?: string[];
  childrens?: List[];
}

export interface NavList {
  title: string;
  lists: List[];
}

export function useNavData() {
  const { t } = useLocales();

  const adminDatas: NavList[] = [
    {
      title: t("menu.app"),
      lists: [
        {
          title: t("overview"),
          icon: "hugeicons:layout-grid",
          path: paths.dashboard.root,
        },
      ],
    },
    {
      title: t("menu.management"),
      lists: [
        {
          title: t("user"),
          icon: "solar:user-linear",
          path: paths.dashboard.user.root,
          roles: [config.ROLE.ADMIN],
          childrens: [
            {
              title: t("menu_sub_list.list"),
              path: paths.dashboard.user.root,
            },
            {
              title: t("menu_sub_list.create"),
              path: paths.dashboard.user.create,
            },
          ],
        },
        {
          title: t("treatment"),
          icon: "healthicons:water-treatment-outline",
          roles: [config.ROLE.ADMIN, TREATMENT.DETAILS],
          path: paths.dashboard.treatment.root,
          childrens: [
            {
              title: t("menu_sub_list.list"),
              path: paths.dashboard.treatment.root,
              roles: [config.ROLE.ADMIN, TREATMENT.LIST],
            },
            {
              title: t("menu_sub_list.create"),
              path: paths.dashboard.treatment.create,
              roles: [config.ROLE.ADMIN, TREATMENT.CREATE],
            },
          ],
        },
      ],
    },
    {
      title: t("menu.service"),
      lists: [
        {
          title: t("patient"),
          icon: "fluent:patient-20-regular",
          path: paths.dashboard.patient.root,
          roles: [config.ROLE.ADMIN, PATIENT.DETAILS],
          childrens: [
            {
              title: t("menu_sub_list.list"),
              path: paths.dashboard.patient.root,
              roles: [config.ROLE.ADMIN, PATIENT.LIST],
            },
            {
              title: t("menu_sub_list.create"),
              path: paths.dashboard.patient.create,
              roles: [config.ROLE.ADMIN, PATIENT.CREATE],
            },
          ],
        },
        {
          title: t("invoice"),
          icon: "hugeicons:google-doc",
          roles: [config.ROLE.ADMIN, INVOICE.DETAILS],
          path: paths.dashboard.invoice.root,
        },
      ],
    },
  ];

  // const data = useMemo(() => {
  //   const datas: AdminNavData[] = adminDatas.map((adminData) => ({
  //     paths: adminData.paths.filter((path) => {
  //       const title = `${path.title.toLowerCase()}-list`;
  //       return permissions?.includes(title);
  //     }),
  //   }));

  //   return isAdmin ? adminDatas : datas;
  // }, [permissions]);

  return adminDatas;
}
