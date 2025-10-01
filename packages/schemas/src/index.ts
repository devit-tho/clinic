// import {
//   ChangePasswordDto,
//   CreateUserDto,
//   DetailDto,
//   InvoiceDto,
//   LoginUserDto,
//   PatientDto,
//   ResetPasswordDto,
//   TreatmentDto,
//   UserBaseDto,
// } from "@repo/dto";
// import { gender, role, status } from "@repo/entities";
// import { z } from "zod";

// // ----------------------------------------------------------------------

// interface CreateUpdatePatientSchemaFormValue extends PatientDto {}

// export const createUpdatePatientSchema = z.object({
//   name: z.string().min(1, { message: "Name is required" }),
//   age: z.number().min(1, { message: "Age is required" }).max(120, {
//     message: "Age must be between 1 and 120",
//   }),
//   phoneNumber: z
//     .string()
//     .min(9, { message: "Phone number is required" })
//     .max(12, {
//       message: "Phone number must be between 9 and 12",
//     })
//     .refine((v) => !isNaN(parseInt(v)), {
//       message: "Phone number must be a number",
//     }),
//   gender: z.enum([gender.Male, gender.Female], {
//     message: "Gender is required",
//   }),
// }) satisfies z.ZodType<CreateUpdatePatientSchemaFormValue>;

// export type CreateUpdatePatientSchema = z.infer<
//   typeof createUpdatePatientSchema
// >;

// // ----------------------------------------------------------------------

// interface TreatmentSchemaFormValue extends TreatmentDto {}

// export const createUpdateTreatmentSchema = z
//   .object({
//     type: z.string(),
//     price: z.number(),
//   })
//   .strict() satisfies z.ZodType<TreatmentSchemaFormValue>;

// export type CreateUpdateTreatmentSchema = z.infer<
//   typeof createUpdateTreatmentSchema
// >;

// // ----------------------------------------------------------------------

// interface InvoiceSchemaFormValue extends Omit<InvoiceDto, "patientId"> {}

// export const invoiceSchema = z
//   .object({
//     status: z.enum([status.NO_DETAILS, status.PENDING, status.SUCCESS]),
//     discount: z.number(),
//     total: z.number(),
//     newDeposit: z.number(),
//   })
//   .strict() satisfies z.ZodType<InvoiceSchemaFormValue>;

// export type InvoiceSchema = z.infer<typeof invoiceSchema>;

// // ----------------------------------------------------------------------

// interface DetailSchemaFormValue
//   extends Omit<DetailDto, "patientId" | "invoiceId"> {}

// export const detailSchema = z
//   .object({
//     treatmentId: z.string().min(1, { message: "Treatment is required" }),
//     tooth: z
//       .array(z.number().min(11).max(48))
//       .refine((v) => new Set(v).size === v.length, {
//         message: "Tooth must be unique",
//       }),
//     upper: z.number(),
//     lower: z.number(),
//   })
//   .refine((v) => v.lower + v.upper > 0, {
//     message: "Atleast one upper or lower tooth is required",
//   }) satisfies z.ZodType<DetailSchemaFormValue>;

// export type DetailSchema = z.infer<typeof detailSchema>;

// // ----------------------------------------------------------------------

// interface InvoiceDetailSchemaFormValue {
//   patient: CreateUpdatePatientSchema;
//   invoice: InvoiceSchema;
//   detail?: DetailSchema;
//   details: DetailSchema[];
// }

// export const invoiceDetailSchema = z.object({
//   patient: createUpdatePatientSchema,
//   invoice: invoiceSchema,
//   details: z.array(detailSchema).min(1, {
//     message: "Details is required",
//   }),
// }) satisfies z.ZodType<InvoiceDetailSchemaFormValue>;

// export type InvoiceDetailSchema = z.infer<typeof invoiceDetailSchema>;

// // ----------------------------------------------------------------------

// interface UserBaseSchemaFormValue extends UserBaseDto {}

// export const userBaseSchema = z.object({
//   firstName: z.string(),
//   lastName: z.string(),
//   email: z.string().email(),
//   gender: z.enum([gender.Male, gender.Female]),
//   role: z.enum([role.ADMIN, role.DOCTOR, role.STAFF]),
//   phoneNumber: z.string(),
//   dateOfBirth: z
//     .date({
//       message: "Date is required",
//     })
//     .max(new Date(), { message: "Too young, please pick a date" }),
//   imageUrl: z.string().nullable(),
//   placeOfBirth: z.object({}).nullable(),
// }) satisfies z.ZodType<UserBaseSchemaFormValue>;

// export type UserBaseSchema = z.infer<typeof userBaseSchema>;

// // ----------------------------------------------------------------------

// interface CreateUserSchemaFormValue extends CreateUserDto {
//   toggle: boolean;
// }

// export const createUserSchema = userBaseSchema.extend({
//   toggle: z.boolean(),
//   password: z.string(),
//   confirmPassword: z.string(),
// }) satisfies z.ZodType<CreateUserSchemaFormValue>;

// export type CreateUserSchema = z.infer<typeof createUserSchema>;

// // ----------------------------------------------------------------------

// interface UpdateUserSchemaFormValue extends UserBaseDto {}

// export const updateUserSchema =
//   userBaseSchema satisfies z.ZodType<UpdateUserSchemaFormValue>;

// export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

// // ----------------------------------------------------------------------

// interface ChangePasswordFormValue extends ChangePasswordDto {}

// export const changePasswordSchema = z
//   .object({
//     currentPassword: z.string(),
//     newPassword: z.string(),
//     confirmPassword: z.string(),
//   })
//   .refine((d) => d.newPassword === d.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   }) satisfies z.ZodType<ChangePasswordFormValue>;

// export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

// // ----------------------------------------------------------------------

// interface ResetPasswordFormValue extends Omit<ResetPasswordDto, "userId"> {}

// export const resetPasswordSchema = z
//   .object({
//     newPassword: z.string(),
//     confirmPassword: z.string(),
//   })
//   .refine((d) => d.newPassword === d.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   }) satisfies z.ZodType<ResetPasswordFormValue>;

// export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

// // ----------------------------------------------------------------------

// interface LoginSchemaFormValue extends Omit<LoginUserDto, "device"> {}

// export const loginSchema = z.object({
//   username: z.string(),
//   password: z.string(),
// }) satisfies z.ZodType<LoginSchemaFormValue>;

// export type LoginSchema = z.infer<typeof loginSchema>;

export * from "./invoice.schema";

export * from "./patient.schema";

export * from "./treatment.schema";

export * from "./user.schema";
