"use client";
import { Grid, usePiece } from "lytenyte-pro";
import { useEffect, useMemo, useState } from "react";
import type { GridSpec } from "../types";
import {
  matchesStringExpression,
  resolveColumnField,
} from "./string-expression-filter";

export function useStringFilter(columns: Grid.Column<GridSpec>[]) {
  const [stringFilter, setStringFilter] = useState<Record<string, string>>({});
  const stringFilterModel = usePiece(stringFilter, setStringFilter);

  const [debouncedFilter, setDebouncedFilter] = useState<
    Record<string, string>
  >({});
  useEffect(() => {
    const t = setTimeout(() => setDebouncedFilter(stringFilter), 150);
    return () => clearTimeout(t);
  }, [stringFilter]);

  const filterFn = useMemo<Grid.T.FilterFn<GridSpec["data"]> | null>(() => {
    const entries = Object.entries(debouncedFilter).filter(([, v]) => v.trim());
    if (entries.length === 0) return null;

    return (row) => {
      return entries.every(([colId, expr]) => {
        const col = columns.find((c) => c.id === colId);
        if (!col) return true;
        const value = resolveColumnField(col, row);
        return matchesStringExpression(String(value ?? ""), expr);
      });
    };
  }, [debouncedFilter, columns]);

  return { filterFn, stringFilterModel };
}
