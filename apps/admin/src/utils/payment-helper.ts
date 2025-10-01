// import _ from "lodash";
// import { CurrencyType, initialCurrency } from "./currency";
// import { Detail, Patient } from "./models";

// export const invoicePayment = {
//   currentPayment: "currentPayment",
//   defaultPayment: "defaultPayment",
//   discount: "discount",
//   deposit: "deposit",
//   balance: "balance",
//   newDeposit: "newDeposit",
// } as const;

// type PaymentMap = Record<keyof typeof invoicePayment, CurrencyType>;

// export interface PatientInvoice {
//   patient: Pick<Patient, "name" | "phoneNumber" | "genderId" | "age">;
//   invoice: PaymentMap & {
//     treatmentStatusId: number;
//   };
//   detail: {
//     treatmentId: number;
//     lower: number;
//     upper: number;
//   };
//   details: Detail[];
// }

// export const initialInvoicePayment = _.mapValues(
//   invoicePayment,
//   () => initialCurrency
// );

// export const initialPatientInvoice: PatientInvoice = {
//   patient: { name: "", age: 0, phoneNumber: "", genderId: 0 },
//   invoice: {
//     ...initialInvoicePayment,
//     treatmentStatusId: 2,
//   },
//   detail: {
//     treatmentId: 0,
//     lower: 0,
//     upper: 0,
//   },
//   details: [],
// };

// interface HandleNewDepositProps<T> {
//   e: React.ChangeEvent<HTMLInputElement>;
//   initialValue: T;
//   setFieldValue: FormikProps<T>["setFieldValue"];
//   values: T;
// }

// export function handleDiscountEn({
//   e,
//   setFieldValue,
//   values,
//   initialValue,
// }: HandleNewDepositProps<PatientInvoice>) {
//   const discountEn = +e.target.value || 0;
//   const discountKh = discountEn * 4100;

//   const currentPaymentEnCalc =
//     values.invoice.defaultPayment.en - discountEn < 0
//       ? values.invoice.defaultPayment.en
//       : values.invoice.defaultPayment.en - discountEn;

//   const currentPaymentKhCalc =
//     values.invoice.defaultPayment.kh - discountKh < 0
//       ? values.invoice.defaultPayment.kh
//       : values.invoice.defaultPayment.kh - discountKh;

//   const balanceEnCalc =
//     values.invoice.balance.en < 0 ? 0 : values.invoice.balance.en;

//   const balanceKhCalc =
//     currentPaymentKhCalc <= 0
//       ? values.invoice.defaultPayment.kh - values.invoice.deposit.kh
//       : currentPaymentKhCalc;

//   setFieldValue(
//     "invoice.discount.en",
//     discountEn >= values.invoice.defaultPayment.en ? 0 : discountEn
//   );
//   setFieldValue(
//     "invoice.discount.kh",
//     discountKh >= values.invoice.defaultPayment.kh ? 0 : discountKh
//   );

//   setFieldValue("invoice.currentPayment.en", currentPaymentEnCalc);
//   setFieldValue("invoice.currentPayment.kh", currentPaymentKhCalc);

//   setFieldValue("invoice.balance.en", balanceEnCalc);
//   setFieldValue("invoice.balance.kh", balanceKhCalc);
// }

// export function handleDiscountKh({
//   e,
//   setFieldValue,
//   values,
// }: HandleNewDepositProps<PatientInvoice>) {
//   const discountKh = +e.target.value || 0;
//   const discountEn = discountKh / 4100;

//   const currentPaymentEnCalc = values.invoice.defaultPayment.en - discountEn;
//   const currentPaymentKhCalc = values.invoice.defaultPayment.kh - discountKh;

//   setFieldValue(
//     "invoice.discount.kh",
//     discountKh >= values.invoice.defaultPayment.kh
//       ? values.invoice.defaultPayment.kh
//       : discountKh
//   );
//   setFieldValue(
//     "invoice.discount.en",
//     discountEn >= values.invoice.defaultPayment.en
//       ? values.invoice.defaultPayment.en
//       : discountEn
//   );

//   setFieldValue(
//     "invoice.currentPayment.en",
//     currentPaymentEnCalc < 0 ? 0 : currentPaymentEnCalc
//   );
//   setFieldValue(
//     "invoice.currentPayment.kh",
//     currentPaymentKhCalc < 0 ? 0 : currentPaymentKhCalc
//   );

//   // setFieldValue();
//   // setFieldValue();
// }

// export function handleNewDepositKh({
//   e,
//   setFieldValue,
//   values,
// }: HandleNewDepositProps<PatientInvoice>): void {
//   const newDepositKh = +e.target.value || 0;
//   const newDepositEn = +newDepositKh / 4100;

//   const depositKh =
//     values.invoice.deposit.kh - values.invoice.newDeposit.kh + newDepositKh;
//   const depositEn =
//     values.invoice.deposit.en - values.invoice.newDeposit.en + newDepositEn;

//   const balanceEn =
//     values.invoice.balance.en + values.invoice.newDeposit.en - newDepositEn;
//   const balanceKh =
//     values.invoice.balance.kh + values.invoice.newDeposit.kh - newDepositKh;

//   setFieldValue(
//     "invoice.newDeposit.kh",
//     newDepositKh >= values.invoice.currentPayment.kh
//       ? values.invoice.currentPayment.kh
//       : newDepositKh
//   );
//   setFieldValue(
//     "invoice.newDeposit.en",
//     newDepositEn >= values.invoice.currentPayment.en
//       ? values.invoice.currentPayment.en
//       : newDepositEn
//   );
//   setFieldValue(
//     "invoice.deposit.en",
//     depositEn >= values.invoice.currentPayment.en
//       ? values.invoice.currentPayment.en
//       : depositEn
//   );
//   setFieldValue(
//     "invoice.deposit.kh",
//     depositKh >= values.invoice.currentPayment.kh
//       ? values.invoice.currentPayment.kh
//       : depositKh
//   );
//   setFieldValue("invoice.balance.en", balanceEn < 0 ? 0 : balanceEn);
//   setFieldValue("invoice.balance.kh", balanceKh < 0 ? 0 : balanceKh);
// }

// export function handleNewDepositEn({
//   e,
//   setFieldValue,
//   values,
//   initialValue,
// }: HandleNewDepositProps<PatientInvoice>): void {
//   const newDepositEn = +e.target.value || 0;
//   const newDepositKh = +newDepositEn * 4100;

//   const depositEn =
//     values.invoice.deposit.en - values.invoice.newDeposit.en + newDepositEn;
//   const depositKh =
//     values.invoice.deposit.kh - values.invoice.newDeposit.kh + newDepositKh;

//   const balanceEn =
//     values.invoice.balance.en + values.invoice.newDeposit.en - newDepositEn;
//   const balanceKh =
//     values.invoice.balance.kh + values.invoice.newDeposit.kh - newDepositKh;

//   console.log(initialValue);

//   setFieldValue(
//     "invoice.newDeposit.kh",
//     newDepositKh >= values.invoice.currentPayment.kh
//       ? values.invoice.currentPayment.kh
//       : newDepositKh
//   );
//   setFieldValue(
//     "invoice.newDeposit.en",
//     newDepositEn >= initialValue.invoice.balance.en
//       ? values.invoice.balance.en
//       : newDepositEn
//   );
//   setFieldValue(
//     "invoice.deposit.en",
//     depositEn >= values.invoice.currentPayment.en
//       ? values.invoice.currentPayment.en
//       : depositEn
//   );
//   setFieldValue(
//     "invoice.deposit.kh",
//     depositKh >= values.invoice.currentPayment.kh
//       ? values.invoice.currentPayment.kh
//       : depositKh
//   );
//   setFieldValue("invoice.balance.en", balanceEn < 0 ? 0 : balanceEn);
//   setFieldValue("invoice.balance.kh", balanceKh < 0 ? 0 : balanceKh);
// }
