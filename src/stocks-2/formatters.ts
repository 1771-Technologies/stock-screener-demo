export const twoDecimalPlace = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCompactNumber(n: number) {
  const suffixes = ["", "K", "M", "B", "T"];
  let magnitude = 0;
  let num = Math.abs(n);

  while (num >= 1000 && magnitude < suffixes.length - 1) {
    num /= 1000;
    magnitude++;
  }

  const decimals = 2;
  const formatted = num.toFixed(decimals);

  return [`${n < 0 ? "-" : ""}${formatted}`, suffixes[magnitude]];
}
