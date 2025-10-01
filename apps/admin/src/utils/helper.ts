// import { FormikProps } from 'formik';

// // -------------------------------------------------------

// interface handlePhoneNumberProps<T> {
//   e: React.ChangeEvent<HTMLInputElement>;
//   setFieldValue: FormikProps<T>['setFieldValue'];
//   phoneNumber?: string;
//   isPatient?: boolean;
// }

// export function handlePhoneNumber<T>({
//   e,
//   setFieldValue,
//   phoneNumber,
//   isPatient,
// }: handlePhoneNumberProps<T>) {
//   const patientField = isPatient ? 'patient.phoneNumber' : 'phoneNumber';
//   const inputValue = e.target.value;

//   // Check if the input value is a valid number or starts with 0
//   if (/^\d+$/.test(inputValue) || inputValue === '0') {
//     setFieldValue(patientField, inputValue);
//   } else {
//     // Handle non-numeric input, you might want to clear the field or show an error message
//     setFieldValue(patientField, phoneNumber ? phoneNumber : '');
//   }
// }
