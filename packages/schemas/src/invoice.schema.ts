import { excludeFields, Status } from "@repo/entities";
import { z } from "zod";
import {
  DetailSchema as DetailSchemaGenerated,
  InvoiceSchema as InvoiceSchemaGenerated,
  PaymentSchema,
  StatusSchema,
} from "./generated";
import { ObjectIdSchema } from "./utils";

// ----------------------------------------------------------------------

export const InvoiceSchema = InvoiceSchemaGenerated.extend({
  id: ObjectIdSchema(),
  paymentId: ObjectIdSchema(),
  patientId: ObjectIdSchema(),
});

export type InvoiceType = z.infer<typeof InvoiceSchema>;

export const DetailSchema = DetailSchemaGenerated.extend({
  id: ObjectIdSchema(),
  treatmentId: ObjectIdSchema({
    required: "Treatment is required",
    min: "Treatment cannot be empty",
  }),
  patientId: ObjectIdSchema({
    required: "Patient is required",
    min: "Patient cannot be empty",
    invalid: "Invalid patientId",
  }),
  invoiceId: ObjectIdSchema({
    required: "Invoice is required",
    min: "Invoice cannot be empty",
    invalid: "Invalid invoiceId",
  }),
  tooth: DetailSchemaGenerated.shape.tooth.refine(
    (v) => new Set(v).size === v.length,
    {
      error: "Tooth must be unique",
    }
  ),
}).refine((v) => v.lower + v.upper > 0, {
  error: "Atleast one upper or lower tooth is required",
});

export type DetailType = z.infer<typeof DetailSchema>;

// ----------------------------------------------------------------------

export const CreateOrUpdateInvoiceSchema = InvoiceSchema.omit({
  id: true,
  invNo: true,
  paymentId: true,
  createdAt: true,
  ...excludeFields,
})
  .extend({
    status: StatusSchema.catch(Status.PENDING),
    discount: PaymentSchema.shape.discount,
    total: PaymentSchema.shape.total,
    deposit: PaymentSchema.shape.deposit,
    newDeposit: z.number().nullish().catch(0),
  })
  .superRefine((data, ctx) => {
    if (data.newDeposit && data.newDeposit > data.deposit) {
      ctx.addIssue({
        code: "custom",
        message: "New deposit cannot be greater than deposit",

        path: ["newDeposit"],
      });
    }

    // if (data.total - data.discount < 0) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "Total cannot be less than discount",
    //     path: ["total"],
    //     input: data.total,
    //   });
    // }
  });

export type CreateOrUpdateInvoiceType = z.infer<
  typeof CreateOrUpdateInvoiceSchema
>;

export const CreateOrUpdateDetailSchema = DetailSchema.omit({
  createdAt: true,
  invoiceId: true,
  ...excludeFields,
}).extend({
  id: ObjectIdSchema()
    .transform((v) => (v === "" ? undefined : v))
    .nullish(),
});

export type CreateOrUpdateDetailType = z.infer<
  typeof CreateOrUpdateDetailSchema
>;

export const CreateOrUpdateInvoiceDetailSchema = z
  .object({
    invoice: CreateOrUpdateInvoiceSchema,
    details: z.array(CreateOrUpdateDetailSchema).min(1, {
      error: "Details is required",
    }),
    // detail: CreateOrUpdateDetailSchema,
  })
  .strict();

export type CreateOrUpdateInvoiceDetailType = z.infer<
  typeof CreateOrUpdateInvoiceDetailSchema
>;
