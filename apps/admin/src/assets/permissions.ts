import { INVOICE, PATIENT, TREATMENT } from "@/utils/permission-data";

export default [
  {
    name: "Patient",
    checked: false,
    items: [
      {
        name: "List",
        key: PATIENT.LIST,
        checked: false,
      },
      {
        name: "Details",
        key: PATIENT.DETAILS,
        checked: false,
      },
      {
        name: "Create",
        key: PATIENT.CREATE,
        checked: false,
      },
      {
        name: "Update",
        key: PATIENT.UPDATE,
        checked: false,
      },
      {
        name: "Delete",
        key: PATIENT.DELETE,
        checked: false,
      },
      {
        name: "View Invoices",
        key: PATIENT.VIEW_INVOICES,
        checked: false,
      },
      {
        name: "Create Invoices",
        key: PATIENT.CREATE_INVOICES,
        checked: false,
      },
      {
        name: "Update Invoices",
        key: PATIENT.UPDATE_INVOICES,
        checked: false,
      },
      {
        name: "Delete Invoices",
        key: PATIENT.DELETE_INVOICES,
        checked: false,
      },
      {
        name: "View Details",
        key: PATIENT.VIEW_DETAILS,
        checked: false,
      },
    ],
  },
  {
    name: "Invoice",
    checked: false,
    items: [
      {
        name: "List",
        key: INVOICE.LIST,
        checked: false,
      },
      {
        name: "Details",
        key: INVOICE.DETAILS,
        checked: false,
      },
      {
        name: "Print",
        key: INVOICE.PRINT,
        checked: false,
      },
      {
        name: "View Details",
        key: INVOICE.DETAILS,
        checked: false,
      },
    ],
  },
  {
    name: "Treatment",
    checked: false,
    items: [
      {
        name: "List",
        key: TREATMENT.LIST,
        checked: false,
      },
      {
        name: "Details",
        key: TREATMENT.DETAILS,
        checked: false,
      },
      {
        name: "Create",
        key: TREATMENT.CREATE,
        checked: false,
      },
      {
        name: "Update",
        key: TREATMENT.UPDATE,
        checked: false,
      },
      {
        name: "Delete",
        key: TREATMENT.DELETE,
        checked: false,
      },
    ],
  },
  // {
  //   name: "Patient Invoices",
  //   checked: false,
  //   items: [
  //     {
  //       name: "Details",
  //       checked: false,
  //     },
  //     {
  //       name: "Create",
  //       checked: false,
  //     },
  //     {
  //       name: "Update",
  //       checked: false,
  //     },
  //     {
  //       name: "Delete",
  //       checked: false,
  //     },
  //     {
  //       name: "Print",
  //       checked: false,
  //     },
  //     {
  //       name: "View Details",
  //       checked: false,
  //     },
  //   ],
  // },
];
