"use client";
import { Grid, usePiece } from "lytenyte-pro";
import { useEffect, useMemo, useState } from "react";
import { GridSpec } from "../types";
import { matchesNumberExpression } from "./number-expression-filter";
import { resolveColumnField } from "./string-expression-filter";

export function useNumberFilter(columns: Grid.Column<GridSpec>[]) {
  const [numberFilter, setNumberFilter] = useState<Record<string, string>>({});
  const numberFilterModel = usePiece(numberFilter, setNumberFilter);

  const [debouncedFilter, setDebouncedFilter] = useState<Record<string, string>>({});
  useEffect(() => {
    const t = setTimeout(() => setDebouncedFilter(numberFilter), 150);
    return () => clearTimeout(t);
  }, [numberFilter]);

  const filterFn = useMemo<Grid.T.FilterFn<GridSpec["data"]> | null>(() => {
    const entries = Object.entries(debouncedFilter).filter(([, v]) => v.trim());
    if (entries.length === 0) return null;

    return (row) => {
      return entries.every(([colId, expr]) => {
        const col = columns.find((c) => c.id === colId);
        if (!col) return true;
        const raw = resolveColumnField(col, row);
        const value = raw == null ? null : Number(raw);
        return matchesNumberExpression(Number.isNaN(value) ? null : value, expr);
      });
    };
  }, [debouncedFilter, columns]);

  return { filterFn, numberFilterModel };
}
