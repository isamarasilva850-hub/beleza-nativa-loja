export function getCustomColorName(productRef: string, originalColor: string): string {
  if (typeof window === "undefined") return originalColor;

  try {
    const overrides = JSON.parse(localStorage.getItem("belezanativa_color_overrides") || "[]");
    const override = overrides.find((o: any) => o.productRef === productRef && o.originalColor === originalColor);
    return override ? override.newColor : originalColor;
  } catch {
    return originalColor;
  }
}
