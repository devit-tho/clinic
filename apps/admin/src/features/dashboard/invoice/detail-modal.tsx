import AppTable, { Column } from "@/components/app-table";
import { useLocales } from "@/locales";
import { formatPrice } from "@/utils/format";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Detail, DetailTreatment } from "@repo/entities";
import { DetailDisclosureProp } from "./types";

// ----------------------------------------------------------------------

const DetailModal: React.FC<
  Omit<DetailDisclosureProp, "patient" | "value"> & {
    details: DetailTreatment[];
  }
> = ({ details, invNo, isOpen, onOpenChange, onClose }) => {
  const { t } = useLocales();

  const columns: Column[] = [
    { name: t("type"), field: "type" },
    { name: t("price"), field: "price" },
    { name: t("detail.teeth"), field: "tooth" },
    { name: t("detail.upper"), field: "upper" },
    { name: t("detail.lower"), field: "lower" },
    { name: t("number"), field: "number" },
    { name: t("total"), field: "total" },
  ];

  const total = details.reduce<number>((pv, cv) => {
    const number = cv.upper + cv.lower;
    return pv + (cv as DetailTreatment).treatment.price * number;
  }, 0);

  function renderCell(detail: DetailTreatment, columnKey: React.Key) {
    const cellValue = detail[columnKey as keyof Detail];

    const tooth = detail.tooth.join(", ");

    const number = detail.upper + detail.lower;

    switch (columnKey) {
      case "type":
        return <span>{detail.treatment.type}</span>;
      case "price":
        return <span>$ {formatPrice(detail.treatment.price)}</span>;
      case "tooth":
        return <span>{tooth}</span>;
      case "number":
        return <span>{number}</span>;
      case "total":
        return <span>$ {formatPrice(detail.treatment.price * number)}</span>;
      default:
        return cellValue;
    }
  }

  return (
    <Modal
      backdrop="blur"
      onOpenChange={onOpenChange}
      size="3xl"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>{invNo}</ModalHeader>
        <ModalBody>
          <AppTable<DetailTreatment>
            filterName="tooth"
            shadow="none"
            showBottomContent={false}
            showTopContent={false}
            datas={details as DetailTreatment[]}
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
            ]}
            tableDataLoading={false}
          />
        </ModalBody>
        <ModalFooter className="items-center">
          <span className="mr-auto">
            {t("total")}: $ {formatPrice(total)}
          </span>
          <Button color="primary" variant="light" onPress={onClose}>
            {t("action.close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailModal;
