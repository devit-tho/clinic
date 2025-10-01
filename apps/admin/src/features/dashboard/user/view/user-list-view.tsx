import { useUsers } from "@/api/user";
import AppTable, { Column } from "@/components/app-table";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { EmptyContent } from "@/components/empty-content";
import Iconify from "@/components/iconify";
import constant from "@/config";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { UserWithoutPassword } from "@repo/entities";
import lowerCase from "lodash/lowerCase";

// ----------------------------------------------------------------

const UserList: React.FC = () => {
  const { t } = useLocales();
  const { datas, loading } = useUsers();
  const router = useRouter();

  const columns: Column[] = [
    { name: t("name"), field: "alias", sortable: true },
    { name: t("username"), field: "username", sortable: true },
    { name: t("gender"), field: "gender" },
    { name: t("phone_number"), field: "phoneNumber" },
    { name: t("role"), field: "role", sortable: true },
    { name: t("serve_patient"), field: "patients", sortable: true },
    { name: t("action.title"), field: "actions" },
  ];

  const invisibleColumns = [
    "alias",
    "username",
    "gender",
    "phoneNumber",
    "role",
    "patients",
    "actions",
  ];

  const emptyContent = (
    <EmptyContent icon="solar:user-linear" content="No user found" />
  );

  const title = t("page_title.user.list");

  function editUser(id: string) {
    router.push(paths.dashboard.user.edit(id));
  }

  function resetUserPassword(id: string) {
    router.push(paths.dashboard.user.resetPassword(id));
  }

  function goToPermission(id: string) {
    router.push(paths.dashboard.user.permission(id));
  }

  const renderCell = (user: UserWithoutPassword, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof UserWithoutPassword];

    switch (columnKey) {
      case "alias":
        return (
          <div className="flex items-center gap-x-2.5">
            <Avatar src="/images/profile.jpg" />
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize text-default-700">
                {user.firstName} {user.lastName}
              </p>
              <span className="text-tiny text-default-400">{user.email}</span>
            </div>
          </div>
        );
      case "username":
        return <span>{user.username}</span>;
      case "patients":
        return <span>{user._count.patients}</span>;
      case "gender":
        return <span>{t(lowerCase(user.gender))}</span>;
      case "role":
        return <span>{t(lowerCase(user.role))}</span>;
      case "actions":
        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown isDisabled={user.role === constant.ROLE.ADMIN}>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Iconify icon="lucide:more-vertical" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="permission"
                  startContent={<Iconify icon="solar:lock-bold-duotone" />}
                  onPress={() => goToPermission(user.id)}
                >
                  {t("permission")}
                </DropdownItem>
                <DropdownItem
                  key="reset-password"
                  startContent={<Iconify icon="solar:key-bold-duotone" />}
                  onPress={() => resetUserPassword(user.id)}
                >
                  {t("reset_password")}
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  startContent={<Iconify icon="solar:pen-bold-duotone" />}
                  onPress={() => editUser(user.id)}
                >
                  {t("action.edit")}
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  startContent={
                    <Iconify icon="solar:trash-bin-2-bold-duotone" />
                  }
                  color="danger"
                >
                  {t("action.delete")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  };

  if (!datas) return null;

  return (
    <>
      <title>{title}</title>

      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <CustomBreadcrumbs
          heading={t("user")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("user") },
          ]}
        />

        <AppTable<UserWithoutPassword>
          filterName="alias"
          columns={columns}
          dataName={t("user")}
          addItem
          renderCell={renderCell}
          datas={datas}
          tableEmptyContent={emptyContent}
          tableDataLoading={loading}
          invisibleColumns={invisibleColumns}
        />
      </div>
    </>
  );
};

export default UserList;
