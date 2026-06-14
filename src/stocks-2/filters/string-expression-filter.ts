import type { Grid } from "lytenyte-pro";
import type { GridSpec } from "../types";

const specialChars = /[.^$*+?{}[\]\\|()]/;

export function matchesStringExpression(value: string, expr: string): boolean {
  const parts = expr
    .split("||")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return true;

  const strValue = String(value ?? "");
  return parts.some((part) => {
    if (specialChars.test(part)) {
      try {
        return new RegExp(part, "i").test(strValue);
      } catch {
        return strValue.toLowerCase().includes(part.toLowerCase());
      }
    }
    return strValue.toLowerCase().includes(part.toLowerCase());
  });
}

export function resolveColumnField(
  col: Grid.Column<GridSpec>,
  row: Grid.T.RowLeaf<GridSpec["data"]>
): unknown {
  if (typeof col.field === "number") return row.data[col.field];
  if (typeof col.field === "function") {
    try {
      return (col.field as any)({ row, column: col });
    } catch {
      return null;
    }
  }
  if (typeof col.field === "string") return (row.data as any)[col.field];
  return null;
}
