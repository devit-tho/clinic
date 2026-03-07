/**
 * Prisma Zod Generator - Single File (inlined)
 * Auto-generated. Do not edit.
 */

import * as z from 'zod';
// File: DetailScalarFieldEnum.schema.ts

export const DetailScalarFieldEnumSchema = z.enum(['id', 'invoiceId', 'patientId', 'treatmentId', 'upper', 'lower', 'tooth', 'isDeleted', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'deletedAt', 'deletedBy'])

export type DetailScalarFieldEnum = z.infer<typeof DetailScalarFieldEnumSchema>;

// File: InvoiceScalarFieldEnum.schema.ts

export const InvoiceScalarFieldEnumSchema = z.enum(['id', 'invNo', 'status', 'paymentId', 'patientId', 'isDeleted', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'deletedAt', 'deletedBy'])

export type InvoiceScalarFieldEnum = z.infer<typeof InvoiceScalarFieldEnumSchema>;

// File: PatientScalarFieldEnum.schema.ts

export const PatientScalarFieldEnumSchema = z.enum(['id', 'name', 'age', 'phoneNumber', 'gender', 'isDeleted', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'deletedAt', 'deletedBy'])

export type PatientScalarFieldEnum = z.infer<typeof PatientScalarFieldEnumSchema>;

// File: PaymentScalarFieldEnum.schema.ts

export const PaymentScalarFieldEnumSchema = z.enum(['id', 'defaultPayment', 'discount', 'deposit', 'balance', 'total', 'status', 'isDeleted', 'createdAt'])

export type PaymentScalarFieldEnum = z.infer<typeof PaymentScalarFieldEnumSchema>;

// File: PermissionScalarFieldEnum.schema.ts

export const PermissionScalarFieldEnumSchema = z.enum(['id', 'resource', 'actions', 'userId', 'createdAt'])

export type PermissionScalarFieldEnum = z.infer<typeof PermissionScalarFieldEnumSchema>;

// File: TokenScalarFieldEnum.schema.ts

export const TokenScalarFieldEnumSchema = z.enum(['id', 'token', 'userId', 'device', 'isDeleted', 'createdAt'])

export type TokenScalarFieldEnum = z.infer<typeof TokenScalarFieldEnumSchema>;

// File: TreatmentScalarFieldEnum.schema.ts

export const TreatmentScalarFieldEnumSchema = z.enum(['id', 'type', 'price', 'coverage', 'teeth', 'isDeleted', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'deletedAt', 'deletedBy'])

export type TreatmentScalarFieldEnum = z.infer<typeof TreatmentScalarFieldEnumSchema>;

// File: UserScalarFieldEnum.schema.ts

export const UserScalarFieldEnumSchema = z.enum(['id', 'firstName', 'lastName', 'alias', 'username', 'password', 'email', 'dateOfBirth', 'placeOfBirth', 'role', 'imageUrl', 'phoneNumber', 'gender', 'isDeleted', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'deletedAt', 'deletedBy'])

export type UserScalarFieldEnum = z.infer<typeof UserScalarFieldEnumSchema>;

// File: SortOrder.schema.ts

export const SortOrderSchema = z.enum(['asc', 'desc'])

export type SortOrder = z.infer<typeof SortOrderSchema>;

// File: QueryMode.schema.ts

export const QueryModeSchema = z.enum(['default', 'insensitive'])

export type QueryMode = z.infer<typeof QueryModeSchema>;

// File: Status.schema.ts

export const StatusSchema = z.enum(['NO_DETAILS', 'PENDING', 'SUCCESS'])

export type Status = z.infer<typeof StatusSchema>;

// File: Gender.schema.ts

export const GenderSchema = z.enum(['Male', 'Female'])

export type Gender = z.infer<typeof GenderSchema>;

// File: TreatmentCoverage.schema.ts

export const TreatmentCoverageSchema = z.enum(['NONE', 'FULL', 'PARTIAL'])

export type TreatmentCoverage = z.infer<typeof TreatmentCoverageSchema>;

// File: Role.schema.ts

export const RoleSchema = z.enum(['ADMIN', 'DOCTOR', 'STAFF'])

export type Role = z.infer<typeof RoleSchema>;

// File: Detail.schema.ts

export const DetailSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  patientId: z.string(),
  treatmentId: z.string(),
  upper: z.number().int(),
  lower: z.number().int(),
  tooth: z.array(z.number().min(11).max(48)),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  createdBy: z.string(),
  updatedAt: z.date().nullish(),
  updatedBy: z.string().nullish(),
  deletedAt: z.date().nullish(),
  deletedBy: z.string().nullish(),
});

export type DetailType = z.infer<typeof DetailSchema>;


// File: Invoice.schema.ts

export const InvoiceSchema = z.object({
  id: z.string(),
  invNo: z.string(),
  status: StatusSchema.default("NO_DETAILS"),
  paymentId: z.string(),
  patientId: z.string(),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  createdBy: z.string(),
  updatedAt: z.date().nullish(),
  updatedBy: z.string().nullish(),
  deletedAt: z.date().nullish(),
  deletedBy: z.string().nullish(),
});

export type InvoiceType = z.infer<typeof InvoiceSchema>;


// File: Patient.schema.ts

export const PatientSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'errors.name_at_least_3_characters'),
  age: z.number().min(3, "errors.age_at_least_3_years_old").max(120, 'errors.age_cannot_be_more_than_120_years_old').int("errors.age_must_be_integer").positive('errors.age_must_be_positive'),
  phoneNumber: z.string().regex(/^0[1-9]\d{7,8}$/, 'errors.phone_number_invalid'),
  gender: GenderSchema,
  isDeleted: z.boolean(),
  createdAt: z.date(),
  createdBy: z.string(),
  updatedAt: z.date().nullish(),
  updatedBy: z.string().nullish(),
  deletedAt: z.date().nullish(),
  deletedBy: z.string().nullish(),
});

export type PatientType = z.infer<typeof PatientSchema>;


// File: Payment.schema.ts

export const PaymentSchema = z.object({
  id: z.string(),
  defaultPayment: z.number().nonnegative('errors.default_payment_must_be_positive'),
  discount: z.number().min(0, 'errors.discount_at_least_0_percent').max(100, 'errors.discount_cannot_be_more_than_100_percent'),
  deposit: z.number().nonnegative('errors.deposit_must_be_positive'),
  balance: z.number().nonnegative('errors.balance_must_be_positive'),
  total: z.number().nonnegative('errors.total_must_be_positive'),
  status: StatusSchema.default("NO_DETAILS"),
  isDeleted: z.boolean(),
  createdAt: z.date(),
});

export type PaymentType = z.infer<typeof PaymentSchema>;


// File: Permission.schema.ts

export const PermissionSchema = z.object({
  id: z.string(),
  resource: z.string(),
  actions: z.array(z.string()),
  userId: z.string(),
  createdAt: z.date(),
});

export type PermissionType = z.infer<typeof PermissionSchema>;


// File: Token.schema.ts

export const TokenSchema = z.object({
  id: z.string(),
  token: z.string(),
  userId: z.string(),
  device: z.string(),
  isDeleted: z.boolean(),
  createdAt: z.date(),
});

export type TokenType = z.infer<typeof TokenSchema>;


// File: Treatment.schema.ts

export const TreatmentSchema = z.object({
  id: z.string(),
  type: z.string().min(3, 'errors.type_at_least_3_characters'),
  price: z.number().positive('error.price_must_be_positive'),
  coverage: TreatmentCoverageSchema.default("PARTIAL"),
  teeth: z.array(z.number().int()),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  createdBy: z.string(),
  updatedAt: z.date().nullish(),
  updatedBy: z.string().nullish(),
  deletedAt: z.date().nullish(),
  deletedBy: z.string().nullish(),
});

export type TreatmentType = z.infer<typeof TreatmentSchema>;


// File: User.schema.ts

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  alias: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string(),
  dateOfBirth: z.date().nullish(),
  placeOfBirth: z.object({ street: z.string(), city: z.string(), state: z.string(), postalCode: z.string() }).nullish(),
  role: RoleSchema.default("STAFF"),
  imageUrl: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  gender: GenderSchema,
  isDeleted: z.boolean(),
  createdAt: z.date(),
  createdBy: z.string().nullish(),
  updatedAt: z.date().nullish(),
  updatedBy: z.string().nullish(),
  deletedAt: z.date().nullish(),
  deletedBy: z.string().nullish(),
});

export type UserType = z.infer<typeof UserSchema>;

