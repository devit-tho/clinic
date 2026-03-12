import { Gender, Role, Status, TreatmentCoverage } from "@repo/entities";
import {
  ChangePasswordType,
  CreateOrUpdateDetailType,
  CreateOrUpdateInvoiceDetailType,
  CreateOrUpdateInvoiceType,
  CreateOrUpdatePatientType,
  CreateOrUpdateTreatmentType,
  CreateUserType,
  LoginType,
  ResetPasswordType,
  UpdateUserType,
} from "@repo/schemas";

// ----------------------------------------------------------------------

export const patientDefaultValues: CreateOrUpdatePatientType = {
  name: "",
  age: 0,
  phoneNumber: "",
  gender: Gender.Male,
};

export const invoiceDefaultValues: CreateOrUpdateInvoiceType = {
  patientId: "",
  newDeposit: 0,
  status: Status.NO_DETAILS,
  discount: 0,
  deposit: 0,
  total: 0,
  balance: 0,
  defaultPayment: 0,
};

export const detailDefaultValues: CreateOrUpdateDetailType = {
  patientId: "",
  treatmentId: "",
  tooth: [],
  upper: 0,
  lower: 0,
};

export const createUpdateInvoiceDetailDefaultValues: CreateOrUpdateInvoiceDetailType =
  {
    invoice: invoiceDefaultValues,
    details: [],
  };

export const createUpdateTreatmentDefaultValues: CreateOrUpdateTreatmentType = {
  price: 0,
  type: "",
  coverage: TreatmentCoverage.NONE,
  teeth: [],
};

export const userDefaultValues: UpdateUserType = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: new Date(),
  gender: "Male",
  role: Role.STAFF,
  imageUrl: "",
  placeOfBirth: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
  },
};

export const createUserDefaultValues: CreateUserType = {
  ...userDefaultValues,
  toggle: false,
  password: "",
};

export const changePasswordDefaultValues: ChangePasswordType = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const resetPasswordDefaultValues: Omit<ResetPasswordType, "userId"> = {
  password: "",
};

export const loginDefaultValues: Omit<LoginType, "device"> = {
  username: "",
  password: "",
};
