import {
  INVOICE,
  PATIENT,
  PATIENTiNVOICES,
  TREATMENT,
} from "./permission-data";

// ----------------------------------------------------------------

export const patientActions = [
  PATIENT.UPDATE,
  PATIENT.DELETE,
  PATIENT.VIEW_INVOICES,
];

export const invoiceActions = [INVOICE.PRINT, INVOICE.DETAILS];

export const treatmentActions = [TREATMENT.UPDATE, TREATMENT.DELETE];

export const patientInvoicesActions = [
  PATIENTiNVOICES.UPDATE,
  PATIENTiNVOICES.PRINT,
  PATIENTiNVOICES.VIEW_DETAILS,
  PATIENTiNVOICES.DELETE,
];
