import { useInvoices } from "@/api/invoice";
import AppTable, { Column } from "@/components/app-table";
import CustomBreadcrumbs from "@/components/custom-breadcrumb/custom-breadcrumbs";
import { EmptyContent } from "@/components/empty-content";
import config from "@/config";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { useLocales } from "@/locales";
import paths from "@/routes/paths";
import { formatPrice } from "@/utils/format";
import { INVOICE } from "@/utils/permission-data";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useDisclosure } from "@heroui/modal";
import { Icon } from "@iconify/react";
import { InvoiceDetailPatient, Status } from "@repo/entities";
import { format } from "date-fns";
import startCase from "lodash/startCase";
import { useState } from "react";
import { Color } from "../../patient/view/patient-invoice-view";
import DetailModal from "../detail-modal";
import DetailPrint from "../detail-print";

// -----------------------------------------------------------------------------

const InvoiceView: React.FC = () => {
  const { t } = useLocales();
  const { handlePermission } = usePermissionAccess();
  const detailModal = useDisclosure();
  const detailPrint = useDisclosure();
  const { datas, loading } = useInvoices();
  const [detail, setDetail] = useState<InvoiceDetailPatient | null>(null);

  const columns: Column[] = [
    {
      name: t("patient_invoice.invoice_number"),
      field: "invNo",
      sortable: true,
    },
    { name: t("name"), field: "name", sortable: true },
    { name: t("total"), field: "total" },
    { name: t("discount"), field: "discount" },
    { name: t("patient_invoice.current_payment"), field: "current_payment" },
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
    { name: t("patient_invoice.created_at"), field: "created_at" },
    { name: t("action.title"), field: "actions" },
  ];

  const invisibleColumns = [
    "invNo",
    "name",
    "total",
    "discount",
    "current_payment",
    "invoice_status",
    "payment_status",
    "created_at",
    "actions",
  ];

  const emptyContent = (
    <EmptyContent icon="hugeicons:google-doc" content="No invoice found" />
  );

  const title = t("page_title.invoice");

  function onOpenView(invoice: InvoiceDetailPatient) {
    setDetail(invoice);
    detailModal.onOpen();
  }

  function onCloseView() {
    setDetail(null);
    detailModal.onClose();
  }

  function onOpenPrint(invoice: InvoiceDetailPatient) {
    setDetail(invoice);
    detailPrint.onOpen();
  }

  function onClosePrint() {
    setDetail(null);
    detailPrint.onClose();
  }

  const renderCell = (invoice: InvoiceDetailPatient, columnKey: React.Key) => {
    const cellValue = invoice[columnKey as keyof InvoiceDetailPatient];

    function getBadgeColor(s: keyof typeof Status): Color {
      if (s === config.STATUS.PENDING) return "warning";
      if (s === config.STATUS.SUCCESS) return "success";
      return "default";
    }

    switch (columnKey) {
      case "invNo":
        return <span>{invoice.invNo}</span>;
      case "name":
        return <span>{invoice.patient.name}</span>;
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

        if (handlePermission([config.ROLE.ADMIN, INVOICE.DETAILS])) {
          disabledKeys.push("view");
        }

        if (handlePermission([config.ROLE.ADMIN, INVOICE.PRINT])) {
          disabledKeys.push("print");
        }

        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown
              aria-label="main action"
              isDisabled={handlePermission([
                config.ROLE.ADMIN,
                INVOICE.DETAILS,
                INVOICE.PRINT,
              ])}
            >
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Icon icon="lucide:more-vertical" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu disabledKeys={disabledKeys}>
                <DropdownItem
                  key="view"
                  startContent={<Icon icon="lucide:eye" />}
                  onPress={() => onOpenView(invoice)}
                >
                  {t("action.view")}
                </DropdownItem>
                <DropdownItem
                  key="print"
                  startContent={<Icon icon="lucide:printer" />}
                  color="danger"
                  onPress={() => onOpenPrint(invoice)}
                >
                  {t("action.print")}
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
          heading={t("invoice")}
          links={[
            {
              name: t("dashboard"),
              href: paths.dashboard.root,
            },
            { name: t("invoice"), href: paths.dashboard.invoice.root },
          ]}
        />

        <AppTable<InvoiceDetailPatient>
          filterName="invNo"
          datas={datas}
          renderCell={renderCell}
          dataName={t("invoice")}
          columns={columns}
          invisibleColumns={invisibleColumns}
          tableDataLoading={loading}
          tableEmptyContent={emptyContent}
        />

        {detail && (
          <DetailModal
            isOpen={detailModal.isOpen}
            onClose={onCloseView}
            onOpenChange={detailModal.onOpenChange}
            invNo={detail.invNo || ""}
            details={detail.details || []}
          />
        )}

        {detail && (
          <DetailPrint
            patient={detail.patient}
            isOpen={detailPrint.isOpen}
            onClose={onClosePrint}
            onOpenChange={detailPrint.onOpenChange}
            invNo={detail.invNo || ""}
            value={detail}
          />
        )}
      </div>
    </>
  );
};

export default InvoiceView;
