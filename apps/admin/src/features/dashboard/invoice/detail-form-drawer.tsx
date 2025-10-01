import { useTreatments } from "@/api";
import { Tooth } from "@/components/tooth";
import { useLocales } from "@/locales";
import { Item } from "@/utils/default-item";
import { detailDefaultValues } from "@/utils/initial-value";
import { Button } from "@heroui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { CreateOrUpdateDetailType } from "@repo/schemas";
import capitalize from "lodash/capitalize";
import isEmpty from "lodash/isEmpty";
import { useEffect, useMemo, useState } from "react";

// ----------------------------------------------------------------------

interface DetailFormDrawerProps {
  initialValue?: CreateOrUpdateDetailType;
  patientId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  processDetail: (v: CreateOrUpdateDetailType, isUpdate?: boolean) => boolean;
}

// ----------------------------------------------------------------------

function DetailFormDrawer({
  initialValue,
  isOpen,
  onOpenChange,
  onClose,
  processDetail,
  patientId,
}: DetailFormDrawerProps) {
  const [detail, setDetail] = useState<CreateOrUpdateDetailType>({
    ...detailDefaultValues,
    patientId,
  });

  const { t } = useLocales();

  const [price, setPrice] = useState<number>(0);

  const editMode = !isEmpty(initialValue);

  const { treatmentsData } = useTreatments();

  const number = detail.lower + detail.upper;

  const selectedTreatment = useMemo(
    () => treatmentsData.find((d) => d.id === detail.treatmentId),
    [treatmentsData, detail.treatmentId]
  );

  const totalPrice = useMemo(
    () => (selectedTreatment ? selectedTreatment.price * number : 0),
    [selectedTreatment, number]
  );

  const treatments = treatmentsData.map<Item>((d) => ({
    label: d.type,
    key: d.id,
  }));

  useEffect(() => {
    if (isEmpty(initialValue)) return;
    setDetail({
      ...initialValue,
      patientId,
    });
  }, [initialValue]);

  useEffect(() => {
    const treatment = treatmentsData.find((d) => d.id === detail.treatmentId);
    if (!treatment) {
      setPrice(0);
    } else {
      setPrice(treatment.price);
    }
  }, [detail.treatmentId]);

  function onChangePosition(
    position: Pick<CreateOrUpdateDetailType, "upper" | "lower" | "tooth">
  ) {
    setDetail((prev) => ({
      ...prev,
      upper: position.upper,
      lower: position.lower,
      tooth: position.tooth,
    }));
  }

  function onSubmit() {
    const result = processDetail(detail, editMode);

    if (result) {
      setDetail({
        ...detailDefaultValues,
        patientId,
      });
      onClose();
    }
  }

  function handleCloseDrawer() {
    setDetail({
      ...detailDefaultValues,
      patientId,
    });
    onClose();
  }

  return (
    <>
      <Drawer
        backdrop="blur"
        isOpen={isOpen}
        onClose={handleCloseDrawer}
        onOpenChange={onOpenChange}
        size="5xl"
      >
        <DrawerContent>
          <DrawerHeader>{t("patient_invoice_form.detail_form")}</DrawerHeader>
          <DrawerBody>
            <div className="flex">
              <Select
                items={treatments}
                label={t("treatment")}
                placeholder={t("patient_invoice_form.treatment_placeholder")}
                selectedKeys={new Set([detail.treatmentId])}
                isRequired
                onChange={(e) => {
                  setDetail({ ...detail, treatmentId: e.target.value });
                }}
              >
                {(v) => (
                  <SelectItem key={v.key}>{capitalize(v.label)}</SelectItem>
                )}
              </Select>

              <Input
                label={t("price")}
                endContent={<>$</>}
                value={price.toString()}
                isDisabled
              />
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              <Input
                label={t("detail.upper")}
                value={detail.upper.toString()}
                isDisabled
              />
              <Input
                label={t("detail.lower")}
                value={detail.lower.toString()}
                isDisabled
              />

              <Input label={t("number")} value={number.toString()} isDisabled />

              <Input
                label={t("total")}
                value={totalPrice.toString()}
                endContent={<>$</>}
                isDisabled
              />
            </div>

            <Tooth detail={detail} onChangePosition={onChangePosition} />
          </DrawerBody>
          <DrawerFooter>
            <Button color="primary" onPress={onSubmit}>
              {t(editMode ? "action.edit" : "action.create")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default DetailFormDrawer;
