import { useTreatments } from "@/api";
import AppTable, { Column } from "@/components/app-table";
import { RHFTextField } from "@/components/hook-form";
import RHFSelect from "@/components/hook-form/rhf-select";
import Iconify from "@/components/iconify";
import { useLocales } from "@/locales";
import { Item, statuses } from "@/utils/default-item";
import { formatPrice } from "@/utils/format";
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
import lowerCase from "lodash/lowerCase";
import snakeCase from "lodash/snakeCase";
import { useCallback, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
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

  const methods = useFormContext<CreateOrUpdateInvoiceDetailType>();

  const { t } = useLocales();

  const { treatmentsData } = useTreatments();

  const detailFormDrawer = useDisclosure();

  const deleteDetailDialog = useDisclosure();

  const { setValue, watch } = methods;

  const value = watch();

  const treatmentMap = useMemo(
    () =>
      treatmentsData.reduce<Record<string, (typeof treatmentsData)[number]>>(
        (acc, t) => {
          acc[t.id] = t;
          return acc;
        },
        {}
      ),
    [treatmentsData]
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
    [t]
  );

  const renderCell = useCallback(
    (data: CreateOrUpdateDetailType, columnKey: React.Key, ind?: number) => {
      const cellValue = data[columnKey as keyof CreateOrUpdateDetailType];
      const tooth = data.tooth.join(", ");
      const currentTreatment = treatmentMap[data.treatmentId];

      const number = data.upper + data.lower;

      if (isEmpty(currentTreatment)) return null;

      switch (columnKey) {
        case "type":
          return <span>{currentTreatment.type}</span>;
        case "price":
          return <span>$ {formatPrice(currentTreatment.price)}</span>;
        case "tooth":
          return <span>{tooth}</span>;
        case "number":
          return <span>{number}</span>;
        case "total":
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
                  onPress={() => onDeleteDetail(ind as number)}
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
    [t, treatmentMap]
  );

  const statusOptions = statuses.map<Item>((d) => {
    const label = snakeCase(lowerCase(d.label));
    return {
      key: d.key,
      label: t(`status_options.${label}`),
    };
  });

  // useEffect(() => {
  //   setValue("invoice.total", number * price, { shouldValidate: true });
  // }, [number]);

  function processDetail(v: CreateOrUpdateDetailType, isUpdate = false) {
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

    setValue(
      "details",
      isUpdate && editValueIndex !== undefined
        ? value.details.map((d, i) => (i === editValueIndex ? v : d))
        : [...value.details, v],
      {
        shouldValidate: true,
      }
    );

    const currentTreatment = treatmentMap[v.treatmentId];

    const number = v.upper + v.lower;

    const total = number * currentTreatment?.price;

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
      description: "Detail added successfully",
      color: "success",
    });

    return true;
  }

  function onDeleteDetail(index: number) {
    const currentDetail = value.details[index];

    if (currentDetail?.id) {
      deleteDetailDialog.onOpen();
    } else {
      setValue(
        "details",
        value.details.filter((_, i) => i !== index)
      );

      const currentTreatment = treatmentMap[currentDetail.treatmentId];

      const number = currentDetail.upper + currentDetail.lower;

      const total = number * currentTreatment?.price;

      setValue("invoice.defaultPayment", value.invoice.defaultPayment - total, {
        shouldValidate: true,
      });
    }
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
            endContent={<>$</>}
            isDisabled={value.invoice.defaultPayment <= 0 || editMode}
            onChange={(e) => {
              const num = Number(e.target.value);

              const maxDiscount = value.invoice.defaultPayment;
              const correctedDiscount = num > maxDiscount ? maxDiscount : num;

              const newBalance =
                value.invoice.defaultPayment - correctedDiscount;

              setValue("invoice.discount", correctedDiscount, {
                shouldValidate: true,
              });
              setValue("invoice.balance", newBalance > 0 ? newBalance : 0, {
                shouldValidate: true,
              });
              setValue("invoice.total", newBalance > 0 ? newBalance : 0, {
                shouldValidate: true,
              });
            }}
          />

          <Input
            type="number"
            label={t(
              `patient_invoice_form.${editMode ? "new_deposit" : "deposit"}`
            )}
            value={
              editMode
                ? String(value.invoice.newDeposit)
                : String(value.invoice.deposit)
            }
            endContent={<>$</>}
            isDisabled={value.invoice.defaultPayment <= 0}
            onChange={(e) => {
              const val = Number(e.target.value);

              console.log(val);

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
                  remainingBalance
                );

                // Update newDeposit
                setValue("invoice.newDeposit", correctedNewDeposit, {
                  shouldValidate: true,
                });

                // Total deposit = previous + newDeposit
                setValue(
                  "invoice.deposit",
                  previousDeposit + correctedNewDeposit,
                  { shouldValidate: true }
                );

                // Update balance
                setValue(
                  "invoice.balance",
                  total - (previousDeposit + correctedNewDeposit),
                  {
                    shouldValidate: true,
                  }
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
                  }
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

        <AppTable<CreateOrUpdateDetailType>
          showBottomContent={false}
          showTopContent={false}
          datas={value.details}
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
    </>
  );
};

export default InvoiceFormField;
