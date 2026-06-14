"use client";
import { Grid } from "lytenyte-pro";
import { useMemo } from "react";
import { GridSpec } from "../types";
import { stockData } from "../data.js";

export function useColumnValues(columns: Grid.Column<GridSpec>[]) {
  return useMemo(() => {
    const cache = new Map<string, string[]>();
    return (colId: string): string[] => {
      if (cache.has(colId)) return cache.get(colId)!;
      const col = columns.find((c) => c.id === colId);
      if (!col) return [];
      const rawValues = stockData.map((d) => {
        if (typeof col.field === "number") return d[col.field as number];
        if (typeof col.field === "function") {
          try {
            const row = { kind: "leaf", data: d } as any;
            return (col.field as any)({ row, column: col });
          } catch {
            return null;
          }
        }
        return null;
      });
      const unique = [
        ...new Set(rawValues.filter((v) => v != null).map((v) => String(v))),
      ].sort();
      cache.set(colId, unique);
      return unique;
    };
  }, [columns]);
}
