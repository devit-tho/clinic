import {
  Detail as DetailPrisma,
  Gender as GenderPrisma,
  Invoice as InvoicePrisma,
  Patient as PatientPrisma,
  Payment as PaymentPrisma,
  Permission as PermissionPrisma,
  Prisma,
  Role as RolePrisma,
  Status as StatusPrisma,
  Token,
  Treatment as TreatmentPrisma,
  User as UserPrisma,
} from "@repo/database";

function createEnum<T extends string>() {
  return <U extends { [K in T]: T }>(obj: U) => obj;
}

type DefaultField =
  | "isDeleted"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
  | "deletedAt"
  | "deletedBy";

type User = Omit<UserPrisma, DefaultField>;

type JsonValue = Prisma.JsonValue;

type Patient = Omit<PatientPrisma, DefaultField>;

type Invoice = Omit<InvoicePrisma, DefaultField>;

type Detail = Omit<DetailPrisma, DefaultField>;

type Treatment = Omit<TreatmentPrisma, DefaultField>;

type Permission = Pick<PermissionPrisma, "id" | "values">;

type Payment = Omit<PaymentPrisma, DefaultField>;

type PlaceOfBirth = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
};

interface UserWithoutPassword extends Omit<User, "password"> {
  permission: Pick<Permission, "id" | "values"> | null;
  placeOfBirth: PlaceOfBirth | null;
  _count: {
    patients: number;
  };
}

interface LoginResponse {
  user: UserWithoutPassword;
  token: string;
}

type UserPermission = Pick<Permission, "id" | "values"> & {
  user: Pick<User, "alias">;
};

type UserResponse = Pick<User, "username" | "password">;

interface RecentPatient extends Patient {
  user: Pick<UserWithoutPassword, "alias">;
}

interface InvoiceDetail extends Invoice {
  payment: Payment;
  details: DetailTreatment[];
}

interface PatientInvoice extends Patient {
  invoices: InvoiceDetail[];
}

interface InvoiceDetailPatient extends InvoiceDetail {
  patient: Patient;
}

interface DetailTreatment extends Detail {
  treatment: Treatment;
}

const Gender = createEnum<GenderPrisma>()({
  Male: "Male",
  Female: "Female",
});

const Role = createEnum<RolePrisma>()({
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  STAFF: "STAFF",
});

const Status = createEnum<StatusPrisma>()({
  NO_DETAILS: "NO_DETAILS",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
});

const fields: DefaultField[] = [
  "isDeleted",
  "createdBy",
  "updatedAt",
  "updatedBy",
  "deletedAt",
  "deletedBy",
];

type Field = (typeof fields)[number];

const excludeFields = fields.reduce<Record<Field, true>>(
  (pv, cv) => ({ ...pv, [cv]: true }),
  {} as Record<Field, true>
);

export { excludeFields, fields, Gender, Role, Status };

export type {
  DefaultField,
  Detail,
  DetailTreatment,
  Invoice,
  InvoiceDetail,
  InvoiceDetailPatient,
  JsonValue,
  LoginResponse,
  Patient,
  PatientInvoice,
  Payment,
  Permission,
  PermissionPrisma,
  PlaceOfBirth,
  RecentPatient,
  Token,
  Treatment,
  User,
  UserPermission,
  UserResponse,
  UserWithoutPassword,
};
