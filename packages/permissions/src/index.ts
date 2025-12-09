const Resource = {
  patient: "patient",
  invoice: "invoice",
  treatment: "treatment",
} as const;

type Resource = (typeof Resource)[keyof typeof Resource];

const Action = {
  CREATE: "create",
  LIST: "list",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  PRINT: "print",
  VIEW_DETAILS: "view-details",
  CREATE_DETAILS: "create-details",
  UPDATE_DETAILS: "update-details",
  DELETE_DETAILS: "delete-details",
  VIEW_INVOICES: "view-invoices",
  CREATE_INVOICES: "create-invoices",
  UPDATE_INVOICES: "update-invoices",
  DELETE_INVOICES: "delete-invoices",
} as const;

type Action = (typeof Action)[keyof typeof Action];

// function resourceAction<R extends Resource, A extends Action>(
//   resource: R,
//   action: A
// ) {
//   return `${resource}-${action}` as const;
// }

// type ActionsForResource<R extends Resource> = {
//   [A in Action]: `${R}-${A}`;
// };

// const PatientActions: ActionsForResource<typeof Resource.patient> = {
//   [Action.CREATE]: resourceAction(Resource.patient, Action.CREATE),
//   [Action.READ]: resourceAction(Resource.patient, Action.READ),
//   [Action.UPDATE]: resourceAction(Resource.patient, Action.UPDATE),
//   [Action.DELETE]: resourceAction(Resource.patient, Action.DELETE),
//   [Action.PRINT]: resourceAction(Resource.patient, Action.PRINT),
// };
// type PatientActions = (typeof PatientActions)[keyof typeof PatientActions];

// const InvoiceActions: ActionsForResource<typeof Resource.invoice> = {
//   [Action.CREATE]: resourceAction(Resource.invoice, Action.CREATE),
//   [Action.READ]: resourceAction(Resource.invoice, Action.READ),
//   [Action.UPDATE]: resourceAction(Resource.invoice, Action.UPDATE),
//   [Action.DELETE]: resourceAction(Resource.invoice, Action.DELETE),
//   [Action.PRINT]: resourceAction(Resource.invoice, Action.PRINT),
// };
// type InvoiceActions = (typeof InvoiceActions)[keyof typeof InvoiceActions];

// const TreatmentActions: ActionsForResource<typeof Resource.treatment> = {
//   [Action.CREATE]: resourceAction(Resource.treatment, Action.CREATE),
//   [Action.READ]: resourceAction(Resource.treatment, Action.READ),
//   [Action.UPDATE]: resourceAction(Resource.treatment, Action.UPDATE),
//   [Action.DELETE]: resourceAction(Resource.treatment, Action.DELETE),
//   [Action.PRINT]: resourceAction(Resource.treatment, Action.PRINT),
// };

// type TreatmentActions =
//   (typeof TreatmentActions)[keyof typeof TreatmentActions];

// const AllActions = Object.values(Resource).reduce(
//   (pv, cv) => {
//     pv[cv] = Object.values(Action).reduce(
//       (actionPv, actionCv) => {
//         actionPv[actionCv] = resourceAction(cv, actionCv);
//         return actionPv;
//       },
//       {} as Record<Action, string>
//     );
//     return pv;
//   },
//   {} as Record<Resource, Record<Action, string>>
// );

export { Action, Resource };
