import { usePatients } from "@/api";
import { deletePatient as deletePatientApi } from "@/api/patient";
import AppTable, { Column } from "@/components/app-table";
import CustomBreadcrumbs from "@/components/custom-breadcrumb/custom-breadcrumbs";
import { DeleteItem } from "@/components/delete-item";
import { EmptyContent } from "@/components/empty-content";
import Iconify from "@/components/iconify";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
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
import { Action, Resource } from "@repo/permissions";
import capitalize from "lodash/capitalize";
import lowerCase from "lodash/lowerCase";
import { useState } from "react";

// ----------------------------------------------------------------------

const PatientListView: React.FC = () => {
  const { t } = useLocales();

  const { handlePermission } = usePermissionAccess();

  const [deletedPatient, setDeletedPatient] = useState<Patient | null>(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { patientsData, patientsLoading, patientsMutate } = usePatients();

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
      description: t("patient_deleted_success"),
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

        if (
          !handlePermission({
            resource: Resource.patient,
            actions: Action.VIEW_INVOICES,
          })
        ) {
          disabledKeys.push(Action.VIEW_INVOICES);
        }

        if (
          !handlePermission({
            resource: Resource.patient,
            actions: Action.UPDATE,
          })
        ) {
          disabledKeys.push(Action.UPDATE);
        }

        if (
          !handlePermission({
            resource: Resource.patient,
            actions: Action.DELETE,
          })
        ) {
          disabledKeys.push(Action.DELETE);
        }

        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown
              aria-label="main action"
              isDisabled={
                !handlePermission({
                  resource: Resource.patient,
                  actions: [Action.VIEW_INVOICES, Action.UPDATE, Action.DELETE],
                })
              }
            >
              <DropdownTrigger aria-label="action btn trigger">
                <Button isIconOnly size="sm" variant="light">
                  <Iconify icon="lucide:more-vertical" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="action" disabledKeys={disabledKeys}>
                <DropdownItem
                  key={Action.VIEW_INVOICES}
                  aria-label="View patient"
                  startContent={<Iconify icon="solar:eye-bold-duotone" />}
                  onPress={() => viewInvoice(patient.id)}
                >
                  {t(`action.${Action.VIEW_INVOICES}`)}
                </DropdownItem>

                <DropdownItem
                  key={Action.UPDATE}
                  aria-label="Edit patient"
                  startContent={<Iconify icon="solar:pen-bold-duotone" />}
                  onPress={() => editPatient(patient.id)}
                >
                  {t("action.edit")}
                </DropdownItem>

                <DropdownItem
                  key={Action.DELETE}
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
                  {t(`action.${Action.DELETE}`)}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  };

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
          addItem={handlePermission({
            resource: Resource.patient,
            actions: Action.CREATE,
          })}
          reloadData={patientsMutate}
          exportCsv
          csvFileName="patients.csv"
          csvHeader={[
            { key: "name", label: "Name" },
            { key: "age", label: "Age" },
            { key: "phoneNumber", label: "Phone Number" },
            { key: "gender", label: "Gender" },
          ]}
          csvData={
            patientsLoading
              ? []
              : patientsData.map((patient) => ({
                  name: patient.name,
                  age: patient.age,
                  phoneNumber: patient.phoneNumber,
                  gender: capitalize(patient.gender),
                }))
          }
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
