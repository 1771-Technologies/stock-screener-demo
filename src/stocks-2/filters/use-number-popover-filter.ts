"use client";
import { Grid, usePiece } from "lytenyte-pro";
import { useEffect, useMemo, useState } from "react";
import { GridSpec } from "../types";
import {
  NumberColumnFilter,
  matchesNumberColumnFilter,
} from "./number-operator-filter";
import { resolveColumnField } from "./string-expression-filter";

export function useNumberPopoverFilter(
  columns: Grid.Column<GridSpec>[],
  getColumnValues: (colId: string) => string[]
) {
  // Operator filter
  const [operatorFilter, setOperatorFilter] = useState<
    Record<string, NumberColumnFilter>
  >({});
  const numberOperatorModel = usePiece(operatorFilter, setOperatorFilter);

  const [debouncedOperator, setDebouncedOperator] = useState<
    Record<string, NumberColumnFilter>
  >({});
  useEffect(() => {
    const t = setTimeout(() => setDebouncedOperator(operatorFilter), 150);
    return () => clearTimeout(t);
  }, [operatorFilter]);

  const operatorFilterFn = useMemo<Grid.T.FilterFn<GridSpec["data"]> | null>(() => {
    const entries = Object.entries(debouncedOperator);
    if (entries.length === 0) return null;

    return (row) => {
      return entries.every(([colId, filter]) => {
        const col = columns.find((c) => c.id === colId);
        if (!col) return true;
        const raw = resolveColumnField(col, row);
        const value = raw == null ? null : Number(raw);
        return matchesNumberColumnFilter(Number.isNaN(value) ? null : value, filter);
      });
    };
  }, [debouncedOperator, columns]);

  // Set filter
  const [setFilter, setSetFilter] = useState<
    Record<string, Grid.T.RowSelectionLinked>
  >({});
  const numberSetModel = usePiece(setFilter, setSetFilter);

  const [debouncedSet, setDebouncedSet] = useState<
    Record<string, Grid.T.RowSelectionLinked>
  >({});
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSet(setFilter), 150);
    return () => clearTimeout(t);
  }, [setFilter]);

  const setFilterFn = useMemo<Grid.T.FilterFn<GridSpec["data"]> | null>(() => {
    const entries = Object.entries(debouncedSet);
    if (entries.length === 0) return null;

    const excludeMap = new Map<string, Set<string>>();
    for (const [colId, state] of entries) {
      const allValues = getColumnValues(colId);
      const excluded = new Set(
        allValues.filter((v: string) => {
          const child = state.children.get(v);
          const selection =
            child?.selected !== undefined ? child.selected : state.selected;
          return !selection;
        })
      );
      if (excluded.size > 0) excludeMap.set(colId, excluded);
    }

    if (excludeMap.size === 0) return null;

    return (row) => {
      for (const [colId, excluded] of excludeMap) {
        const col = columns.find((c) => c.id === colId);
        if (!col) continue;
        const raw = resolveColumnField(col, row);
        if (excluded.has(String(raw ?? ""))) return false;
      }
      return true;
    };
  }, [debouncedSet, columns, getColumnValues]);

  return { operatorFilterFn, setFilterFn, numberOperatorModel, numberSetModel };
}
