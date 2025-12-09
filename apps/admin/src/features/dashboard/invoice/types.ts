import { UseDisclosureProps } from "@heroui/react";
import { InvoiceDetail, Patient } from "@repo/entities";
import { CreateOrUpdateInvoiceDetailType } from "@repo/schemas";

export interface DetailDisclosureProp extends UseDisclosureProps {
  onOpenChange: (open: boolean) => void;
  patient?: Patient;
  invNo: string;
  value?: InvoiceDetail | CreateOrUpdateInvoiceDetailType;
}
