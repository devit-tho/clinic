import { useTreatments } from "@/api";
import AppTable, { Column } from "@/components/app-table";
import { DeleteItem } from "@/components/delete-item";
import { RHFTextField } from "@/components/hook-form";
import RHFSelect from "@/components/hook-form/rhf-select";
import Iconify from "@/components/iconify";
import { useOptions } from "@/hooks/use-options";
import { useLocales } from "@/locales";
import { formatPrice } from "@/utils/format";
import {
  basedOnCoverage,
  getAllTeeth,
  mutiplyBasedOnCoverage,
} from "@/utils/tooth";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast, useDisclosure } from "@heroui/react";
import { Tooltip } from "@heroui/tooltip";
import {
  CreateOrUpdateDetailSchema,
  CreateOrUpdateDetailType,
  CreateOrUpdateInvoiceDetailType,
} from "@repo/schemas";
import isEmpty from "lodash/isEmpty";
import isNumber from "lodash/isNumber";
import { useCallback, useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import DetailFormDrawer from "./detail-form-drawer";

// ----------------------------------------------------------------------

interface InvoiceFormProps {
  onOpenView: () => void;
  patientId: string;
  invNo: string;
  editMode?: boolean;
}

// ----------------------------------------------------------------------

const InvoiceFormField: React.FC<InvoiceFormProps> = ({
  onOpenView,
  patientId,
  editMode = false,
}) => {
  const [editValueIndex, setEditValueIndex] = useState<number | undefined>();
  const [deleteValueIndex, setDeleteValueIndex] = useState<
    number | undefined
  >();

  const methods = useFormContext<CreateOrUpdateInvoiceDetailType>();

  const { append, remove, fields } = useFieldArray({
    control: methods.control,
    name: "details",
    keyName: "_id",
  });

  const { t } = useLocales();

  const { treatmentsData } = useTreatments();

  const detailFormDrawer = useDisclosure();

  const deleteDetailDialog = useDisclosure();

  const statusOptions = useOptions("status");

  const { setValue, watch } = methods;

  const value = watch();

  const treatmentMap = useMemo(
    () =>
      treatmentsData.reduce<Record<string, (typeof treatmentsData)[number]>>(
        (acc, t) => {
          acc[t.id] = t;
          return acc;
        },
        {},
      ),
    [treatmentsData],
  );

  const columns: Column[] = useMemo(
    () => [
      { name: t("type"), field: "type" },
      { name: t("price"), field: "price" },
      { name: t("detail.teeth"), field: "tooth" },
      { name: t("detail.upper"), field: "upper" },
      { name: t("detail.lower"), field: "lower" },
      { name: t("number"), field: "number" },
      { name: t("total"), field: "total" },
      { name: "", field: "actions" },
    ],
    [t],
  );

  const renderCell = useCallback(
    (
      data: CreateOrUpdateDetailType & { _id: string },
      columnKey: React.Key,
      ind?: number,
    ) => {
      const cellValue = data[columnKey as keyof CreateOrUpdateDetailType];
      const tooth = data.tooth.join(", ");
      const currentTreatment = treatmentMap[data.treatmentId];

      const number = data.upper + data.lower;

      const allTeeth = getAllTeeth();

      const isValidAllTeeth = allTeeth.every((v) => data.tooth.includes(v));

      if (isEmpty(currentTreatment)) return null;

      switch (columnKey) {
        case "type":
          return <span>{currentTreatment.type}</span>;
        case "price":
          return <span>$ {formatPrice(currentTreatment.price)}</span>;
        case "tooth":
          return <span>{isValidAllTeeth ? t("all") : tooth}</span>;
        case "number":
          return <span>{number}</span>;
        case "total":
          if (basedOnCoverage(currentTreatment)) {
            return <span>$ {formatPrice(currentTreatment.price)}</span>;
          }
          return <span>$ {formatPrice(currentTreatment.price * number)}</span>;
        case "actions":
          return (
            <div className="flex items-center gap-2 justify-end">
              <Tooltip
                content={t("action.edit")}
                placement="bottom"
                size="sm"
                color="primary"
              >
                <Button
                  isIconOnly
                  color="primary"
                  variant="light"
                  size="sm"
                  onPress={() => onUpdateDetail(ind as number)}
                >
                  <Iconify icon="solar:pen-bold-duotone" width={18} />
                </Button>
              </Tooltip>

              <Tooltip
                content={t("action.delete")}
                placement="bottom"
                size="sm"
                color="danger"
              >
                <Button
                  isIconOnly
                  color="danger"
                  variant="light"
                  size="sm"
                  onPress={() => openDeleteDrawer(ind as number)}
                >
                  <Iconify icon="solar:trash-bin-2-bold-duotone" width={18} />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [t, treatmentMap],
  );

  // useEffect(() => {
  //   setValue("invoice.total", number * price, { shouldValidate: true });
  // }, [number]);

  function processDetail(v: CreateOrUpdateDetailType, isUpdate = false) {
    try {
      const detailParse = CreateOrUpdateDetailSchema.safeParse(v);

      if (!detailParse.success) {
        detailParse.error.issues.forEach((issue) => {
          addToast({
            description: issue.message,
            color: "danger",
          });
        });
        return false;
      }

      if (isUpdate && typeof editValueIndex === "number") {
        setValue(
          "details",
          value.details.map((d, i) => (i === editValueIndex ? v : d)),
          {
            shouldValidate: true,
          },
        );

        addToast({
          description: t("detail_updated_successfully"),
          color: "success",
        });
      } else {
        append(v);

        addToast({
          description: t("detail_added_successfully"),
          color: "success",
        });
      }

      const currentTreatment = treatmentMap[v.treatmentId];

      if (!currentTreatment) return false;

      const number = v.upper + v.lower;

      const total = mutiplyBasedOnCoverage(number, currentTreatment);

      setValue("invoice.defaultPayment", value.invoice.defaultPayment + total, {
        shouldValidate: true,
      });

      setValue("invoice.total", value.invoice.total + total, {
        shouldValidate: true,
      });

      setValue("invoice.balance", value.invoice.balance + total, {
        shouldValidate: true,
      });

      addToast({
        description: t("detail_added_successfully"),
        color: "success",
      });

      return true;
    } catch (error) {
      addToast({
        description: t("something_went_wrong"),
        color: "danger",
      });

      return false;
    }
  }

  function onDeleteDetail() {
    if (typeof deleteValueIndex !== "number") return;

    const currentDetail = fields[deleteValueIndex];

    const currentTreatment = treatmentMap[currentDetail.treatmentId];

    if (!currentTreatment) return;

    const number = currentDetail.upper + currentDetail.lower;
    const total = mutiplyBasedOnCoverage(number, currentTreatment);

    remove(deleteValueIndex);

    setValue("invoice.defaultPayment", value.invoice.defaultPayment - total, {
      shouldValidate: true,
    });
    setValue("invoice.discount", currentTreatment.price / fields.length, {
      shouldValidate: true,
    });
    setValue("invoice.total", value.invoice.total - total, {
      shouldValidate: true,
    });

    addToast({
      description: t("detail_removed_successfully"),
      color: "success",
    });

    deleteDetailDialog.onClose();
  }

  function openDeleteDrawer(index: number) {
    setDeleteValueIndex(index);
    deleteDetailDialog.onOpen();
  }

  function onUpdateDetail(index: number) {
    setEditValueIndex(index);
    detailFormDrawer.onOpen();
  }

  function onCloseDrawer() {
    setEditValueIndex(undefined);
    detailFormDrawer.onClose();
  }

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <RHFSelect
            name="invoice.status"
            label={t("status")}
            items={statusOptions}
          />

          <RHFTextField
            name="invoice.defaultPayment"
            type="number"
            showZero
            label={t("patient_invoice_form.default_payment")}
            endContent={<>$</>}
            isDisabled
          />

          <Input
            type="number"
            value={String(value.invoice.discount)}
            label={t("discount")}
            min={0}
            max={100}
            endContent={<>%</>}
            isDisabled={value.invoice.defaultPayment <= 0 || editMode}
            onChange={(e) => {
              const num = Number(e.target.value);

              const depositField = editMode
                ? (value.invoice.newDeposit ?? 0)
                : (value.invoice.deposit ?? 0);

              const correctedDiscount = num >= 100 ? 100 : num;

              const newBalance =
                (value.invoice.defaultPayment - depositField) *
                (1 - correctedDiscount / 100);

              const total =
                value.invoice.defaultPayment * (1 - correctedDiscount / 100);

              setValue("invoice.discount", correctedDiscount, {
                shouldValidate: true,
              });
              setValue("invoice.balance", newBalance, {
                shouldValidate: true,
              });
              setValue("invoice.total", total, {
                shouldValidate: true,
              });
            }}
          />

          <Input
            type="number"
            label={t(
              `patient_invoice_form.${editMode ? "new_deposit" : "deposit"}`,
            )}
            value={
              editMode
                ? String(value.invoice.newDeposit || 0)
                : String(value.invoice.deposit)
            }
            endContent={<>$</>}
            isDisabled={value.invoice.defaultPayment <= 0}
            onChange={(e) => {
              const val = Number(e.target.value);

              if (editMode) {
                const rawNewDeposit = Number(val);

                // previousDeposit is what was already deposited, excluding newDeposit
                const previousDeposit =
                  value.invoice.deposit - (value.invoice.newDeposit || 0);

                const total =
                  value.invoice.defaultPayment - value.invoice.discount;

                // Clamp newDeposit to remaining balance
                const remainingBalance = total - previousDeposit;
                const correctedNewDeposit = Math.min(
                  rawNewDeposit,
                  remainingBalance,
                );

                // Update newDeposit
                setValue("invoice.newDeposit", correctedNewDeposit, {
                  shouldValidate: true,
                });

                // Total deposit = previous + newDeposit
                setValue(
                  "invoice.deposit",
                  previousDeposit + correctedNewDeposit,
                  { shouldValidate: true },
                );

                // Update balance
                setValue(
                  "invoice.balance",
                  total - (previousDeposit + correctedNewDeposit),
                  {
                    shouldValidate: true,
                  },
                );
              } else {
                const finalDeposit = Math.min(val, value.invoice.total);

                setValue("invoice.deposit", finalDeposit, {
                  shouldValidate: true,
                });

                setValue(
                  "invoice.balance",
                  value.invoice.total - finalDeposit,
                  {
                    shouldValidate: true,
                  },
                );
              }
            }}
          />

          {editMode && (
            <RHFTextField
              name="invoice.deposit"
              type="number"
              showZero
              label={t("patient_invoice_form.deposit")}
              endContent={<>$</>}
              isDisabled
            />
          )}
          {/* <Input
            label={t("patient_invoice_form.current_payment")}
            isDisabled
            value={currentPayment.toString()}
            endContent={<>$</>}
          /> */}
          <RHFTextField
            name="invoice.balance"
            type="number"
            showZero
            label={t("balance")}
            endContent={<>$</>}
            isDisabled
          />

          <RHFTextField
            name="invoice.total"
            type="number"
            label={t("total")}
            endContent={<>$</>}
            showZero
            isDisabled
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between flex-wrap items-center">
            <h2 className="text-lg font-bold">{t("detail.title")}</h2>

            <div className="flex justify-end gap-x-2">
              <Button
                variant="flat"
                color="primary"
                onPress={onOpenView}
                startContent={<Iconify icon="lucide:printer" />}
                isDisabled={value.details.length === 0}
              >
                {t("action.print")}
              </Button>

              <Button
                variant="flat"
                color="primary"
                onPress={detailFormDrawer.onOpen}
                startContent={<Iconify icon="lucide:plus" />}
              >
                {t("patient_invoice_form.add_detail")}
              </Button>
            </div>
          </div>
        </div>

        <AppTable<CreateOrUpdateDetailType & { _id: string }>
          showBottomContent={false}
          showTopContent={false}
          datas={fields}
          columns={columns}
          renderCell={renderCell}
          dataName="Details"
          invisibleColumns={[
            "type",
            "price",
            "tooth",
            "upper",
            "lower",
            "number",
            "total",
            "actions",
          ]}
          tableDataLoading={false}
        />
      </div>

      <DetailFormDrawer
        initialValue={
          isNumber(editValueIndex) ? value.details[editValueIndex] : undefined
        }
        patientId={patientId}
        isOpen={detailFormDrawer.isOpen}
        onOpenChange={detailFormDrawer.onOpenChange}
        onClose={onCloseDrawer}
        processDetail={processDetail}
      />

      <DeleteItem
        title={"detail"}
        onClose={deleteDetailDialog.onClose}
        isOpen={deleteDetailDialog.isOpen}
        onOpenChange={deleteDetailDialog.onOpenChange}
        onPress={onDeleteDetail}
      />
    </>
  );
};

export default InvoiceFormField;
