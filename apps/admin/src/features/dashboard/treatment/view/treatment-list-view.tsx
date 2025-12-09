import { useTreatments } from "@/api";
import { deleteTreatment as deleteTreatmentApi } from "@/api/treatment";
import AppTable, { Column } from "@/components/app-table";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { DeleteItem } from "@/components/delete-item";
import { EmptyContent } from "@/components/empty-content";
import Iconify from "@/components/iconify";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useDisclosure } from "@heroui/react";
import { Treatment } from "@repo/entities";
import { Action, Resource } from "@repo/permissions";
import { useState } from "react";

// ----------------------------------------------------------------------

const TreatmentList: React.FC = () => {
  const { t } = useLocales();
  const { handlePermission } = usePermissionAccess();
  const [deletedTreatment, setDeletedTreatment] = useState<Treatment | null>(
    null
  );
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const { treatmentsData, treatmentsLoading } = useTreatments();
  const router = useRouter();

  const columns: Column[] = [
    { name: t("type"), field: "type" },
    { name: t("price"), field: "price" },
    { name: t("action.title"), field: "actions" },
  ];

  const invisibleColumns = ["type", "price", "actions"];

  const emptyContent = (
    <EmptyContent
      icon="healthicons:water-treatment-outline"
      content="Treatment not found"
    />
  );

  const title = t("page_title.treatment.list");

  function editTreatment(id: string) {
    router.push(paths.dashboard.treatment.edit(id));
  }

  async function deleteTreatment() {
    await deleteTreatmentApi(deletedTreatment as Treatment);
  }

  function renderCell(treatment: Treatment, columnKey: React.Key) {
    const cellValue = treatment[columnKey as keyof Treatment];

    switch (columnKey) {
      case "price":
        return <span>$ {treatment.price}</span>;
      case "actions":
        const disabledKeys = [];

        if (
          !handlePermission({
            resource: Resource.treatment,
            actions: Action.UPDATE,
          })
        ) {
          disabledKeys.push(Action.UPDATE);
        }

        if (
          !handlePermission({
            resource: Resource.treatment,
            actions: Action.DELETE,
          })
        ) {
          disabledKeys.push(Action.DELETE);
        }

        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown
              aria-label="Treatment action"
              isDisabled={
                !handlePermission({
                  resource: Resource.treatment,
                  actions: [Action.UPDATE, Action.DELETE],
                })
              }
            >
              <DropdownTrigger aria-label="treatment action btn">
                <Button isIconOnly size="sm" variant="light">
                  <Iconify icon="lucide:more-vertical" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Treatment menu"
                disabledKeys={disabledKeys}
              >
                <DropdownItem
                  key={Action.UPDATE}
                  startContent={<Iconify icon="solar:pen-bold-duotone" />}
                  onPress={() => editTreatment(treatment.id)}
                >
                  {t("action.edit")}
                </DropdownItem>
                <DropdownItem
                  key={Action.DELETE}
                  startContent={
                    <Iconify icon="solar:trash-bin-2-bold-duotone" />
                  }
                  color="danger"
                  onPress={() => {
                    setDeletedTreatment(treatment);
                    onOpen();
                  }}
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
  }

  if (!treatmentsData) return null;

  return (
    <>
      <title>{title}</title>

      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <CustomBreadcrumbs
          heading={t("treatment")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("treatment"), href: paths.dashboard.treatment.root },
            { name: t("menu_sub_list.list") },
          ]}
        />

        <AppTable<Treatment>
          filterName="type"
          dataName={t("treatment")}
          datas={treatmentsData}
          tableDataLoading={treatmentsLoading}
          tableEmptyContent={emptyContent}
          renderCell={renderCell}
          columns={columns}
          invisibleColumns={invisibleColumns}
          addItem={handlePermission({
            resource: Resource.treatment,
            actions: Action.CREATE,
          })}
        />

        <DeleteItem
          title={t("treatment")}
          onClose={onClose}
          onOpenChange={onOpenChange}
          isOpen={isOpen}
          onPress={deleteTreatment}
        />
      </div>
    </>
  );
};

export default TreatmentList;
