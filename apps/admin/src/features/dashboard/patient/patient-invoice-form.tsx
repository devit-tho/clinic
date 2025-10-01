import FormProvider from "@/components/hook-form";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import { FormProps } from "@/types";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Patient, Status } from "@repo/entities";
import {
  CreateOrUpdateInvoiceDetailSchema,
  CreateOrUpdateInvoiceDetailType,
} from "@repo/schemas";
import isEmpty from "lodash/isEmpty";
import { useForm } from "react-hook-form";
import { DetailPrint } from "../invoice";
import InvoiceFormField from "../invoice/invoice-form-field";

// ----------------------------------------------------------------------

const PatientInvoiceForm: React.FC<
  FormProps<
    CreateOrUpdateInvoiceDetailType,
    CreateOrUpdateInvoiceDetailType
  > & { patientId: string; invNo: string; patient: Patient }
> = ({ onSubmit, initialValues, patientId, invNo, patient }) => {
  const router = useRouter();

  const { t } = useLocales();

  const previewPDFModal = useDisclosure();

  const editMode = !isEmpty(initialValues);

  const defaultValues: CreateOrUpdateInvoiceDetailType = {
    invoice: {
      discount: initialValues?.invoice.discount || 0,
      total: initialValues?.invoice.total || 0,
      newDeposit: initialValues?.invoice.newDeposit || 0,
      status: initialValues?.invoice.status || Status.PENDING,
      deposit: initialValues?.invoice.deposit || 0,
      patientId,
    },
    details: initialValues?.details || [],
  };

  const methods = useForm<CreateOrUpdateInvoiceDetailType>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(CreateOrUpdateInvoiceDetailSchema),
  });

  const {
    watch,
    formState: { isSubmitting },
    handleSubmit,
  } = methods;

  const value = watch();

  const submit = handleSubmit(async (v: CreateOrUpdateInvoiceDetailType) => {
    try {
      await onSubmit(v);

      const message = editMode ? "invoice_form.edited" : "invoice_form.created";

      addToast({
        description: t(message),
        color: "success",
      });

      router.back();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <FormProvider methods={methods} onSubmit={submit}>
        <div className="flex flex-col gap-y-4">
          <InvoiceFormField
            onOpenView={previewPDFModal.onOpen}
            patientId={patientId}
            invNo={invNo}
          />

          <div className="flex items-center justify-end gap-x-2">
            <Button
              type="submit"
              color="primary"
              isDisabled={value.details.length === 0}
              isLoading={isSubmitting}
            >
              {t(editMode ? "action.edit" : "add")}
            </Button>
          </div>
        </div>
      </FormProvider>

      <DetailPrint
        patient={patient}
        value={value as CreateOrUpdateInvoiceDetailType}
        invNo={invNo}
        onOpenChange={previewPDFModal.onOpenChange}
        onClose={previewPDFModal.onClose}
        isOpen={previewPDFModal.isOpen}
      />
    </>
  );
};

export default PatientInvoiceForm;
