import { useInvoices } from "@/api/invoice";
import AppTable, { Column } from "@/components/app-table";
import CustomBreadcrumbs from "@/components/custom-breadcrumb/custom-breadcrumbs";
import { EmptyContent } from "@/components/empty-content";
import config from "@/config";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { useLocales } from "@/locales";
import paths from "@/routes/paths";
import { formatPrice } from "@/utils/format";
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
import { Action, Resource } from "@repo/permissions";
import { format } from "date-fns";
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
  const { invoicesData, invoicesLoading, invoicesMutate } = useInvoices();
  const [detail, setDetail] = useState<InvoiceDetailPatient>();

  const columns: Column[] = [
    {
      name: t("patient_invoice.invoice_number"),
      field: "invNo",
      sortable: true,
    },
    { name: t("name"), field: "name", sortable: true },
    {
      name: t("default_payment"),
      field: "default_payment",
      sortable: true,
    },
    { name: t("discount"), field: "discount" },
    { name: t("deposit"), field: "deposit" },
    { name: t("balance"), field: "balance" },
    { name: t("total"), field: "total" },
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
    "default_payment",
    "discount",
    "deposit",
    "balance",
    "total",
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
    setDetail(undefined);
    detailModal.onClose();
  }

  function onOpenPrint(invoice: InvoiceDetailPatient) {
    setDetail(invoice);
    detailPrint.onOpen();
  }

  function onClosePrint() {
    setDetail(undefined);
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
      case "default_payment":
        return <span>$ {formatPrice(invoice.payment.defaultPayment)}</span>;
      case "discount":
        return <span>$ {formatPrice(invoice.payment.discount)}</span>;
      case "deposit":
        return <span>$ {formatPrice(invoice.payment.deposit)}</span>;
      case "balance":
        return <span>$ {formatPrice(invoice.payment.balance)}</span>;
      case "total":
        return <span>$ {formatPrice(invoice.payment.total)}</span>;
      // case "current_payment":
      //   return <span>$ {formatPrice(invoice.payment.currentPayment)}</span>;
      case "invoice_status":
        return (
          <Chip color={getBadgeColor(invoice.status)} className="text-white">
            {t(`status_options.${invoice.status.toLowerCase()}`)}
          </Chip>
        );
      case "payment_status":
        return (
          <Chip
            color={getBadgeColor(invoice.payment.status)}
            className="text-white"
          >
            {t(`status_options.${invoice.payment.status.toLowerCase()}`)}
          </Chip>
        );
      case "created_at":
        return <span>{format(invoice.createdAt, config.DATE_FORMAT)}</span>;
      case "actions":
        const disabledKeys = [];

        if (
          !handlePermission({
            resource: Resource.invoice,
            actions: Action.VIEW_DETAILS,
          })
        ) {
          disabledKeys.push(Action.VIEW_DETAILS);
        }

        if (
          !handlePermission({
            resource: Resource.invoice,
            actions: Action.PRINT,
          })
        ) {
          disabledKeys.push(Action.PRINT);
        }

        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown
              aria-label="main action"
              isDisabled={
                !handlePermission({
                  resource: Resource.invoice,
                  actions: [Action.VIEW_DETAILS, Action.PRINT],
                })
              }
            >
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Icon icon="lucide:more-vertical" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu disabledKeys={disabledKeys}>
                <DropdownItem
                  key={Action.VIEW_DETAILS}
                  startContent={<Icon icon="lucide:eye" />}
                  onPress={() => onOpenView(invoice)}
                >
                  {t(`action.${Action.VIEW_DETAILS}`)}
                </DropdownItem>
                <DropdownItem
                  key={Action.PRINT}
                  startContent={<Icon icon="lucide:printer" />}
                  color="danger"
                  onPress={() => onOpenPrint(invoice)}
                >
                  {t(`action.${Action.PRINT}`)}
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
          datas={invoicesData}
          renderCell={renderCell}
          dataName={t("invoice")}
          columns={columns}
          invisibleColumns={invisibleColumns}
          tableDataLoading={invoicesLoading}
          tableEmptyContent={emptyContent}
          reloadData={invoicesMutate}
          exportCsv
          csvData={
            invoicesLoading
              ? []
              : invoicesData.map((invoice) => ({
                  invNo: invoice.invNo,
                  name: invoice.patient.name,
                  default_payment: invoice.payment.defaultPayment,
                  discount: invoice.payment.discount,
                  deposit: invoice.payment.deposit,
                  balance: invoice.payment.balance,
                  total: invoice.payment.total,
                  invoice_status: invoice.status.toLowerCase(),
                  payment_status: invoice.payment.status.toLowerCase(),
                  created_at: format(invoice.createdAt, config.DATE_FORMAT),
                }))
          }
          csvFileName="invoices.csv"
          csvHeader={[
            { key: "invNo", label: "Inv No" },
            { key: "name", label: "Name" },
            { key: "default_payment", label: "Default Payment" },
            { key: "discount", label: "Discount" },
            { key: "deposit", label: "Deposit" },
            { key: "balance", label: "Balance" },
            { key: "total", label: "Total" },
            { key: "invoice_status", label: "Invoice Status" },
            { key: "payment_status", label: "Payment Status" },
            { key: "created_at", label: "Created At" },
          ]}
        />

        <DetailModal
          isOpen={detailModal.isOpen}
          onClose={onCloseView}
          onOpenChange={detailModal.onOpenChange}
          invNo={detail?.invNo || ""}
          details={detail?.details || []}
        />

        <DetailPrint
          patient={detail?.patient}
          isOpen={detailPrint.isOpen}
          onClose={onClosePrint}
          onOpenChange={detailPrint.onOpenChange}
          invNo={detail?.invNo || ""}
          value={detail}
        />
      </div>
    </>
  );
};

export default InvoiceView;
