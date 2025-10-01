import { Button } from "@heroui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
// import { PDFViewer, pdf } from "@react-pdf/renderer";
// import DetailPDF from "./detail-pdf";
import { useTreatments } from "@/api";
import Iconify from "@/components/iconify";
import Logo from "@/components/logo";
import { formatPrice } from "@/utils/format";
import { Card, CardBody } from "@heroui/card";
import {
  DetailTreatment,
  InvoiceDetail,
  Status,
  Treatment,
} from "@repo/entities";
import { CreateOrUpdateInvoiceDetailType } from "@repo/schemas";
import { format } from "date-fns";
import capitalize from "lodash/capitalize";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { DetailDisclosureProp } from "./types";
import config from "@/config";
// --

const DetailPrint: React.FC<DetailDisclosureProp> = ({
  value,
  invNo,
  isOpen,
  onOpenChange,
  onClose,
  patient,
}) => {
  const contentRef = useRef(null);
  const reactPrint = useReactToPrint({ contentRef });

  const { treatmentsData } = useTreatments();

  const treatmentMap = useMemo(
    () =>
      treatmentsData.reduce<Record<string, Treatment[][number]>>((acc, t) => {
        acc[t.id] = t;
        return acc;
      }, {}),
    [treatmentsData]
  );

  const calculatedTotal = useMemo(() => {
    if (isEmpty(value)) return "0";
    const total = value.details.reduce((pv, cv) => {
      const treatment = (cv as DetailTreatment)?.treatment
        ? (cv as DetailTreatment).treatment
        : treatmentMap[cv.treatmentId];

      const number = cv.upper + cv.lower;

      return pv + treatment.price * number;
    }, 0);
    return formatPrice(total);
  }, [value, treatmentMap]);

  const { discountValue, currentPaymentValue, depositValue, statusValue } =
    useMemo(() => {
      if (isEmpty(value)) {
        return {
          createdDate: new Date(),
          statusValue: Status.PENDING as keyof typeof Status,
          discountValue: "0",
          currentPaymentValue: "0",
          depositValue: "0",
        };
      }

      if (has(value, "payment.currentPayment")) {
        const v = value as InvoiceDetail;
        return {
          createdDate: v.createdAt,
          statusValue: v.status,
          discountValue: formatPrice(v.payment.discount),
          currentPaymentValue: formatPrice(v.payment.currentPayment),
          depositValue: formatPrice(v.payment.deposit),
        };
      }

      const v = value as CreateOrUpdateInvoiceDetailType;

      return {
        createdDate: new Date(),
        statusValue: v.invoice.status,
        discountValue: formatPrice(v.invoice.discount),
        currentPaymentValue: formatPrice(v.invoice.total - v.invoice.discount),
        depositValue: formatPrice(v.invoice.deposit),
      };
    }, [value]);

  useLayoutEffect(() => {
    if (isEmpty(value)) {
      onClose?.();
    }
  }, [value]);

  // const PDF = <DetailPDF />;

  // async function downloadPDF() {
  //   const asPdf = pdf();
  //   asPdf.updateContainer(PDF);
  //   const blob = await asPdf.toBlob();
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = `${invNo}.pdf`;
  //   link.click();
  //   URL.revokeObjectURL(url);
  // }

  function printPDF() {
    reactPrint();
  }

  if (isEmpty(value)) return null;

  return (
    <Drawer
      onOpenChange={onOpenChange}
      onClose={onClose}
      isOpen={isOpen}
      placement="right"
      size="4xl"
      backdrop="blur"
    >
      <DrawerContent>
        <DrawerHeader>{invNo}</DrawerHeader>
        <DrawerBody>
          {/* <PDFViewer>{PDF}</PDFViewer> */}
          <Card
            shadow="sm"
            classNames={{
              base: "h-full",
              body: "p-0",
            }}
          >
            <CardBody>
              <div ref={contentRef} className="p-5 space-y-5">
                <Logo disabledLink className="size-20" />

                <div className="flex gap-x-8">
                  <div className="space-y-1">
                    <h2 className="text-default-900 font-medium">Patient</h2>

                    <div className="flex flex-col gap-y-0.5 text-default-700">
                      <span className="text-sm">Name: {patient.name}</span>
                      <span className="text-sm">Age: {patient.age}</span>
                      <span className="text-sm">
                        Gender: {capitalize(patient.gender)}
                      </span>
                      <span className="text-sm">
                        Phone: {patient.phoneNumber}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-default-900 font-medium">Invoice</h2>

                    <div className="flex flex-col gap-y-0.5 text-default-700">
                      <span className="text-sm">{invNo}</span>
                      <span className="text-sm">
                        Status: {capitalize(statusValue)}
                      </span>
                      <span className="text-sm">
                        Created Date: {format(new Date(), config.DATE_FORMAT)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col mx-0 mt-8">
                  <table className="min-w-full divide-y divide-default-500">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 font-medium text-sm text-center text-default-800 sm:pl-6 md:pl-0"
                        >
                          No
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-default-800 sm:pl-6 md:pl-0 min-w-28"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="hidden py-3.5 px-3 text-sm font-medium text-default-800 sm:table-cell"
                        >
                          Tooth
                        </th>
                        <th
                          scope="col"
                          className="hidden py-3.5 px-3 text-sm font-medium text-center text-default-800 sm:table-cell"
                        >
                          Upper
                        </th>
                        <th
                          scope="col"
                          className="hidden py-3.5 px-3 text-sm font-medium text-center text-default-800 sm:table-cell"
                        >
                          Lower
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-3 pr-4 text-sm font-medium text-center text-default-800 sm:pr-6 md:pr-0"
                        >
                          Number
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-3 pr-4 text-right text-sm font-medium text-default-800 sm:pr-6 md:pr-0"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-3 pr-4 text-right text-sm font-medium text-default-800 sm:pr-6 md:pr-0"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {value.details.map((d, i) => {
                        const treatment = (d as DetailTreatment)?.treatment
                          ? (d as DetailTreatment).treatment
                          : treatmentMap[d.treatmentId];

                        const teeth = d.tooth.join(", ");

                        const number = d.upper + d.lower;

                        const totalPrice = treatment.price * number;

                        return (
                          <tr key={i} className="border-b border-default-400">
                            <td className="py-4 pl-4 pr-3 text-sm text-default-800 text-center sm:pl-6 md:pl-0">
                              {i + 1}
                            </td>
                            <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                              <div className="font-medium text-default-800">
                                {treatment.type}
                              </div>
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-default-500 sm:table-cell">
                              {teeth}
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-center text-default-500 sm:table-cell">
                              {d.upper}
                            </td>
                            <td className="py-4 pl-3 pr-4 text-sm text-center text-default-500 sm:pr-6 md:pr-0">
                              {d.lower}
                            </td>
                            <td className=" px-3 py-4 text-sm text-center text-default-500 table-cell">
                              {number}
                            </td>
                            <td className="py-4 pl-3 pr-4 text-sm text-right text-default-500 sm:pr-6 md:pr-0">
                              $ {formatPrice(treatment.price)}
                            </td>

                            <td className="px-3 py-4 text-sm text-right text-default-500 sm:pr-6 md:pr-0">
                              $ {formatPrice(totalPrice)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th
                          scope="row"
                          colSpan={7}
                          className="pt-5 pl-6 pr-3 text-sm font-normal text-right text-default-800 table-cell md:pl-0"
                        >
                          Total
                        </th>
                        <td className="pt-5 pl-3 pr-4 text-sm font-normal text-right text-default-800 sm:pr-6 md:pr-0">
                          $ {calculatedTotal}
                        </td>
                      </tr>

                      <tr>
                        <th
                          scope="row"
                          colSpan={7}
                          className="pt-3 pl-6 pr-3 text-sm font-light text-right text-default-700 table-cell md:pl-0"
                        >
                          Discount
                        </th>
                        <td className="pt-3 pl-3 pr-4 text-sm text-right text-default-700 sm:pr-6 md:pr-0">
                          $ {discountValue}
                        </td>
                      </tr>

                      <tr>
                        <th
                          scope="row"
                          colSpan={7}
                          className="pt-3 pl-6 pr-3 text-sm font-light text-right text-default-700 table-cell md:pl-0"
                        >
                          Current Payment
                        </th>
                        <td className="pt-3 pl-3 pr-4 text-sm text-right text-default-700 sm:pr-6 md:pr-0">
                          $ {currentPaymentValue}
                        </td>
                      </tr>

                      <tr>
                        <th
                          scope="row"
                          colSpan={7}
                          className="pt-3 pl-6 pr-3 text-sm font-light text-right text-default-700 table-cell md:pl-0"
                        >
                          Deposit
                        </th>
                        <td className="pt-3 pl-3 pr-4 text-sm text-right text-default-700 sm:pr-6 md:pr-0">
                          $ {depositValue}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </CardBody>
          </Card>
        </DrawerBody>
        <DrawerFooter>
          <Button
            isIconOnly
            radius="full"
            size="lg"
            color="primary"
            onPress={printPDF}
          >
            <Iconify icon="solar:printer-bold-duotone" />
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DetailPrint;
