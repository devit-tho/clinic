import tooth from "@/assets/teeth";
import { Treatment, TreatmentCoverage } from "@repo/entities";

export function selectTeethPosition(
  teethArr: typeof tooth,
  position: "top" | "bottom",
) {
  const items = [];

  for (let i = 0; i < teethArr.length; i++) {
    const teeth = teethArr[i];
    if (teeth?.position === position) {
      for (let j = 0; j < teeth.items.length; j++) {
        const tValues = teeth.items[j]?.values || [];
        for (let k = 0; k < tValues.length; k++) {
          items.push(tValues[k]?.tooth);
        }
      }
    }
  }
  return items;
}

export function getAllTeeth() {
  const teethAllowed: number[] = [];

  for (let i = 1; i <= 4; i++) {
    for (let j = 1; j <= 8; j++) {
      const result = i * 10 + j;
      teethAllowed.push(result);
    }
  }

  return teethAllowed;
}

export function basedOnCoverage(currentTreatment?: Treatment) {
  if (!currentTreatment) return false;
  return (
    currentTreatment.coverage === TreatmentCoverage.FULL ||
    currentTreatment.coverage === TreatmentCoverage.PARTIAL
  );
}

export function mutiplyBasedOnCoverage(
  number: number,
  currentTreatment?: Treatment,
) {
  if (!currentTreatment) return 0;

  const multiplyBasedOnCoverage = basedOnCoverage(currentTreatment);

  return multiplyBasedOnCoverage
    ? currentTreatment.price
    : number * currentTreatment.price;
}
