import { deleteInvoice as deleteInvoiceApi } from "@/api/invoice";
import { usePatient } from "@/api/patient";
import AppTable, { Column } from "@/components/app-table";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { DeleteItem } from "@/components/delete-item";
import { EmptyContent } from "@/components/empty-content";
import Iconify from "@/components/iconify";
import config from "@/config";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { formatPrice } from "@/utils/format";
import { PATIENT } from "@/utils/permission-data";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/react";
import { Invoice, InvoiceDetail, Status } from "@repo/entities";
import { format } from "date-fns";
import omit from "lodash/omit";
import startCase from "lodash/startCase";
import { useReducer } from "react";
import { DetailModal } from "../../invoice";
import DetailPrint from "../../invoice/detail-print";

// ----------------------------------------------------------------------

export type Color =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | undefined;

enum ActionType {
  SET,
  REMOVE,
}

interface initalInvoiceReducer {
  invoice: InvoiceDetail | null;
}

type ReducerAction = {
  type: ActionType;
  payload?: {
    invoice: Invoice | null;
  };
};

interface PatientInvoiceProp {
  id: string;
}

const initialState: initalInvoiceReducer = {
  invoice: null,
};

function reducer(
  state: initalInvoiceReducer,
  action: ReducerAction
): initalInvoiceReducer {
  switch (action.type) {
    case ActionType.SET:
      return { ...state, invoice: action.payload?.invoice as InvoiceDetail };
    case ActionType.REMOVE:
      return { ...state, invoice: null };
    default:
      return state;
  }
}

const PatientInvoiceView: React.FC<PatientInvoiceProp> = ({ id }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useLocales();
  const { patientData, patientLoading } = usePatient(id);
  const { handlePermission } = usePermissionAccess();
  const detailModal = useDisclosure();
  const detailPrintModal = useDisclosure();
  const deleteInvoiceModal = useDisclosure();
  const router = useRouter();

  const columns: Column[] = [
    {
      name: t("patient_invoice.invoice_number"),
      field: "inv_no",
      sortable: true,
    },
    { name: t("total"), field: "total", sortable: true },
    { name: t("discount"), field: "discount", sortable: true },
    {
      name: t("patient_invoice.current_payment"),
      field: "current_payment",
      sortable: true,
    },
    {
      name: t("patient_invoice.invoice_status"),
      field: "invoice_status",
      sortable: true,
    },
    {
      name: t("patient_invoice.payment_status"),
      field: "payment_status",
      sortable: true,
    },
    {
      name: t("patient_invoice.created_at"),
      field: "created_at",
    },
    { name: t("action.title"), field: "actions" },
  ];

  const invisibleColumns = [
    "inv_no",
    "total",
    "discount",
    "current_payment",
    "invoice_status",
    "payment_status",
    "created_at",
    "actions",
  ];

  const title = `${patientData?.name} - ${t("page_title.patient.invoice")}`;

  const emptyContent = (
    <EmptyContent icon="hugeicons:google-doc" content="No invoice found" />
  );

  function editInvoice(patientId: string, invocieId: string) {
    router.push(paths.dashboard.patient.invoiceEdit(patientId, invocieId));
  }

  async function deleteInvoice() {
    await deleteInvoiceApi(state.invoice as Invoice);
    addToast({
      description: "Successfully deleted",
      color: "success",
    });
    deleteInvoiceModal.onClose();
  }

  function onCloseView() {
    dispatch({ type: ActionType.REMOVE });
    detailModal.onClose();
  }

  function onClosePrint() {
    detailPrintModal.onClose();
    setTimeout(() => {
      dispatch({ type: ActionType.REMOVE });
    }, 500);
  }

  function onCloseDelete() {
    dispatch({ type: ActionType.REMOVE });
    deleteInvoiceModal.onClose();
  }

  function renderCell(invoice: InvoiceDetail, columnKey: React.Key) {
    const cellValue = invoice[columnKey as keyof Invoice];

    function getBadgeColor(s: keyof typeof Status): Color {
      if (s === config.STATUS.PENDING) return "warning";
      if (s === config.STATUS.SUCCESS) return "success";
      return "default";
    }

    function onOpenView() {
      dispatch({ type: ActionType.SET, payload: { invoice } });
      detailModal.onOpen();
    }

    function onOpenPrint() {
      dispatch({ type: ActionType.SET, payload: { invoice } });
      detailPrintModal.onOpen();
    }

    function onOpenDelete() {
      dispatch({ type: ActionType.SET, payload: { invoice } });
      deleteInvoiceModal.onOpen();
    }

    switch (columnKey) {
      case "inv_no":
        return <span>{invoice.invNo}</span>;
      case "total":
        return <span>$ {formatPrice(invoice.payment.total)}</span>;
      case "discount":
        return <span>$ {formatPrice(invoice.payment.discount)}</span>;
      case "current_payment":
        return <span>$ {formatPrice(invoice.payment.currentPayment)}</span>;
      case "invoice_status":
        return (
          <Chip color={getBadgeColor(invoice.status)}>
            {startCase(invoice.status)}
          </Chip>
        );
      case "payment_status":
        return (
          <Chip color={getBadgeColor(invoice.payment.status)}>
            {startCase(invoice.payment.status)}
          </Chip>
        );
      case "created_at":
        return (
          <span>{format(new Date(invoice.createdAt), config.DATE_FORMAT)}</span>
        );
      case "actions":
        const disabledKeys = [];

        if (handlePermission([config.ROLE.ADMIN, PATIENT.VIEW_DETAILS])) {
          disabledKeys.push("view");
        }

        if (handlePermission([config.ROLE.ADMIN, PATIENT.PRINT_INVOICES])) {
          disabledKeys.push("print");
        }

        if (handlePermission([config.ROLE.ADMIN, PATIENT.UPDATE_INVOICES])) {
          disabledKeys.push("edit");
        }

        if (handlePermission([config.ROLE.ADMIN, PATIENT.DELETE_INVOICES])) {
          disabledKeys.push("delete");
        }

        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown
              isDisabled={handlePermission([
                config.ROLE.ADMIN,
                PATIENT.VIEW_DETAILS,
                PATIENT.PRINT_INVOICES,
                PATIENT.UPDATE_INVOICES,
                PATIENT.DELETE_INVOICES,
              ])}
            >
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Iconify icon="lucide:more-vertical" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu disabledKeys={disabledKeys}>
                <DropdownItem
                  key="view"
                  startContent={<Iconify icon="solar:eye-bold-duotone" />}
                  onPress={onOpenView}
                >
                  {t("action.view")}
                </DropdownItem>
                <DropdownItem
                  key="print"
                  startContent={<Iconify icon="solar:printer-2-bold-duotone" />}
                  onPress={onOpenPrint}
                >
                  {t("action.print")}
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  startContent={<Iconify icon="solar:pen-bold-duotone" />}
                  onPress={() => editInvoice(invoice.patientId, invoice.id)}
                >
                  {t("action.edit")}
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  startContent={
                    <Iconify icon="solar:trash-bin-2-bold-duotone" />
                  }
                  color="danger"
                  onPress={onOpenDelete}
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

  if (!patientData) return null;

  return (
    <>
      <title>{title}</title>
      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <CustomBreadcrumbs
          heading={t("patient_invoice.title")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("patient"), href: paths.dashboard.patient.root },
            { name: patientData.name },
            { name: t("invoice") },
          ]}
        />

        <AppTable<InvoiceDetail>
          filterName="invNo"
          selectionMode="single"
          invisibleColumns={invisibleColumns}
          addItem={
            !handlePermission([config.ROLE.ADMIN, PATIENT.CREATE_INVOICES])
          }
          columns={columns}
          datas={patientData.invoices}
          tableDataLoading={patientLoading}
          renderCell={renderCell}
          dataName={t("invoice")}
          tableEmptyContent={emptyContent}
        />
      </div>
      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={onCloseView}
        onOpenChange={detailModal.onOpenChange}
        invNo={state.invoice?.invNo || ""}
        details={state.invoice?.details || []}
      />
      <DeleteItem
        onPress={deleteInvoice}
        title={t("invoice")}
        isOpen={deleteInvoiceModal.isOpen}
        onOpenChange={deleteInvoiceModal.onOpenChange}
        onClose={onCloseDelete}
      />

      <DetailPrint
        patient={omit(patientData, ["invoices"])}
        onOpenChange={detailPrintModal.onOpenChange}
        value={state.invoice as InvoiceDetail}
        invNo={state.invoice?.invNo || ""}
        isOpen={detailPrintModal.isOpen}
        onClose={onClosePrint}
      />
    </>
  );
};

export default PatientInvoiceView;
