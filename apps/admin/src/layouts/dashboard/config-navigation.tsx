import { IconifyIcon } from "@/components/iconify";
import { useLocales } from "@/locales";
// Service

import config from "@/config";
import paths from "@/routes/paths";
import { Role } from "@repo/entities";
import { Action, Resource } from "@repo/permissions";

// ----------------------------------------------------------------

export interface List {
  path: string;
  title: string;
  icon?: React.ReactNode | string | IconifyIcon;
  roles?: Role[];
  permission?: { resource: Resource; actions: Action };
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
      ],
    },
    {
      title: t("menu.service"),
      lists: [
        {
          title: t("patient"),
          icon: "fluent:patient-20-regular",
          path: paths.dashboard.patient.root,
          roles: [Role.DOCTOR, Role.STAFF],
          permission: {
            resource: Resource.patient,
            actions: Action.READ,
          },
          childrens: [
            {
              title: t("menu_sub_list.list"),
              path: paths.dashboard.patient.root,
              permission: {
                resource: Resource.patient,
                actions: Action.READ,
              },
            },
            {
              title: t("menu_sub_list.create"),
              path: paths.dashboard.patient.create,
              permission: {
                resource: Resource.patient,
                actions: Action.CREATE,
              },
            },
          ],
        },
        {
          title: t("invoice"),
          icon: "hugeicons:google-doc",
          roles: [Role.DOCTOR, Role.STAFF],
          permission: {
            resource: Resource.invoice,
            actions: Action.READ,
          },
          path: paths.dashboard.invoice.root,
        },
        {
          title: t("treatment"),
          icon: "healthicons:water-treatment-outline",
          roles: [Role.DOCTOR, Role.STAFF],
          path: paths.dashboard.treatment.root,
          permission: {
            resource: Resource.treatment,
            actions: Action.READ,
          },
          childrens: [
            {
              title: t("menu_sub_list.list"),
              path: paths.dashboard.treatment.root,
              permission: {
                resource: Resource.treatment,
                actions: Action.LIST,
              },
            },
            {
              title: t("menu_sub_list.create"),
              path: paths.dashboard.treatment.create,
              permission: {
                resource: Resource.treatment,
                actions: Action.CREATE,
              },
            },
          ],
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
