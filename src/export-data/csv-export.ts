import { Grid } from "lytenyte-pro";

function escapeCsv(value: unknown): string {
  if (value == null) return "";
  const str = String(value);
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function getCsvFile(
  d: Grid.T.ExportDataRectResult<any>,
  includeHeaders: boolean,
): Blob {
  const rows: string[] = [];

  if (includeHeaders) {
    rows.push(d.headers.map(escapeCsv).join(","));
  }

  for (const row of d.data) {
    rows.push(row.map(escapeCsv).join(","));
  }

  return new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
}
