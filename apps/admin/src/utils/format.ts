import numeral from "numeral";

export function formatPhoneNumber(phoneNumber: string) {
  // Check if the input has 9 or 10 digits
  const digitPattern = /^\d{9,10}$/;
  if (!digitPattern.test(phoneNumber)) {
    return "Invalid input format. Please provide a 9 or 10-digit number.";
  }

  // Determine if there is an extra digit (10 digits in total)
  const hasExtraDigit = phoneNumber.length === 10;

  // Format the phone number as 012 456 789X
  const formattedNumber = phoneNumber.replace(
    hasExtraDigit
      ? /^(\d{3})(\d{3})(\d{3})(\d{1})$/
      : /^(\d{3})(\d{3})(\d{3})$/,
    hasExtraDigit ? "$1 $2 $3$4" : "$1 $2 $3"
  );

  return formattedNumber;
}

export function formatPrice(v: number) {
  return numeral(v).format("0,0.00");
}
