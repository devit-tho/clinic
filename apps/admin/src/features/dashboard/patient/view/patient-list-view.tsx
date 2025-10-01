import { usePatients } from "@/api";
import { deletePatient as deletePatientApi } from "@/api/patient";
import AppTable, { Column } from "@/components/app-table";
import CustomBreadcrumbs from "@/components/custom-breadcrumb/custom-breadcrumbs";
import { DeleteItem } from "@/components/delete-item";
import { EmptyContent } from "@/components/empty-content";
import Iconify from "@/components/iconify";
import config from "@/config";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { PATIENT } from "@/utils/permission-data";
import {
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import { Patient } from "@repo/entities";
import lowerCase from "lodash/lowerCase";
import { useState } from "react";

// ----------------------------------------------------------------------

const PatientListView: React.FC = () => {
  const { t } = useLocales();

  const { handlePermission } = usePermissionAccess();

  const [deletedPatient, setDeletedPatient] = useState<Patient | null>(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { patientsData, patientsLoading } = usePatients();

  const router = useRouter();

  const columns: Column[] = [
    { name: t("name"), field: "name", sortable: true },
    { name: t("age"), field: "age", sortable: true },
    { name: t("phone_number"), field: "phoneNumber" },
    { name: t("gender"), field: "gender" },
    { name: t("action.title"), field: "actions" },
  ];

  const invisibleColumns = ["name", "phoneNumber", "age", "gender", "actions"];

  const title = t("page_title.patient.list");

  const emptyContent = (
    <EmptyContent icon="fluent:patient-20-regular" content="No patient found" />
  );

  function editPatient(id: string) {
    router.push(paths.dashboard.patient.edit(id));
  }

  function viewInvoice(id: string) {
    router.push(paths.dashboard.patient.invoice(id));
  }

  async function deletePatient() {
    await deletePatientApi(deletedPatient as Patient);
    addToast({
      description: "Patient deleted successfully",
      color: "success",
    });
    onClose();
  }

  const renderCell = (patient: Patient, columnKey: React.Key) => {
    const cellValue = patient[columnKey as keyof Patient];

    switch (columnKey) {
      case "gender":
        return <span>{t(lowerCase(patient.gender))}</span>;
      case "actions":
        const disabledKeys = [];

        if (handlePermission([config.ROLE.ADMIN, PATIENT.UPDATE])) {
          disabledKeys.push("edit");
        }

        if (handlePermission([config.ROLE.ADMIN, PATIENT.DELETE])) {
          disabledKeys.push("delete");
        }

        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown
              aria-label="main action"
              isDisabled={handlePermission([
                config.ROLE.ADMIN,
                PATIENT.UPDATE,
                PATIENT.DELETE,
              ])}
            >
              <DropdownTrigger aria-label="action btn trigger">
                <Button isIconOnly size="sm" variant="light">
                  <Iconify icon="lucide:more-vertical" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="action" disabledKeys={disabledKeys}>
                <DropdownItem
                  key="view"
                  aria-label="View patient"
                  startContent={<Iconify icon="solar:eye-bold-duotone" />}
                  onPress={() => viewInvoice(patient.id)}
                >
                  {t("action.view")}
                </DropdownItem>

                <DropdownItem
                  key="edit"
                  aria-label="Edit patient"
                  startContent={<Iconify icon="solar:pen-bold-duotone" />}
                  onPress={() => editPatient(patient.id)}
                >
                  {t("action.edit")}
                </DropdownItem>

                <DropdownItem
                  key="delete"
                  aria-label="Delete patient"
                  startContent={
                    <Iconify icon="solar:trash-bin-2-bold-duotone" />
                  }
                  color="danger"
                  onPress={() => {
                    setDeletedPatient(patient);
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
  };

  if (!patientsData) return null;

  return (
    <>
      <title>{title}</title>

      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <CustomBreadcrumbs
          heading={t("patient")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("patient"), href: paths.dashboard.patient.root },
            { name: t("menu_sub_list.list") },
          ]}
        />

        <AppTable<Patient>
          filterName="name"
          selectionMode="single"
          invisibleColumns={invisibleColumns}
          columns={columns}
          datas={patientsData}
          tableDataLoading={patientsLoading}
          tableEmptyContent={emptyContent}
          renderCell={renderCell}
          dataName={t("patient")}
          addItem={!handlePermission([config.ROLE.ADMIN, PATIENT.CREATE])}
        />

        <DeleteItem
          onOpenChange={onOpenChange}
          onClose={onClose}
          isOpen={isOpen}
          onPress={deletePatient}
          title="Patient"
        />
      </div>
    </>
  );
};

export default PatientListView;
