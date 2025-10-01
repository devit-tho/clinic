import tooth from "@/assets/teeth";

export function selectTeethPosition(
  teethArr: typeof tooth,
  position: "top" | "bottom"
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
