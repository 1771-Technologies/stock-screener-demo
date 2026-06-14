"use client";
import { Grid } from "lytenyte-pro";
import { useMemo } from "react";
import type { GridSpec } from "../types";
import { useStringFilter } from "./use-string-filter";
import { useNumberFilter } from "./use-number-filter";
import { useStringPopoverFilter } from "./use-string-popover-filter";
import { useNumberPopoverFilter } from "./use-number-popover-filter";

export function useGridFilters(
  columns: Grid.Column<GridSpec>[],
  getColumnValues: (colId: string) => string[],
) {
  const { filterFn: stringFilterFn, stringFilterModel } =
    useStringFilter(columns);
  const { filterFn: numberFilterFn, numberFilterModel } =
    useNumberFilter(columns);
  const {
    operatorFilterFn: stringOperatorFn,
    setFilterFn: stringSetFn,
    stringOperatorModel,
    stringSetModel,
  } = useStringPopoverFilter(columns, getColumnValues);
  const {
    operatorFilterFn: numberOperatorFn,
    setFilterFn: numberSetFn,
    numberOperatorModel,
    numberSetModel,
  } = useNumberPopoverFilter(columns, getColumnValues);

  const filter = useMemo(() => {
    const active = [
      stringFilterFn,
      numberFilterFn,
      stringOperatorFn,
      stringSetFn,
      numberOperatorFn,
      numberSetFn,
    ].filter(Boolean) as Grid.T.FilterFn<GridSpec["data"]>[];
    return active.length > 0 ? active : null;
  }, [
    stringFilterFn,
    numberFilterFn,
    stringOperatorFn,
    stringSetFn,
    numberOperatorFn,
    numberSetFn,
  ]);

  const extension = useMemo(
    () => ({
      stringFilterModel,
      numberFilterModel,
      stringOperatorModel,
      stringSetModel,
      numberOperatorModel,
      numberSetModel,
      getColumnValues,
    }),
    [
      stringFilterModel,
      numberFilterModel,
      stringOperatorModel,
      stringSetModel,
      numberOperatorModel,
      numberSetModel,
      getColumnValues,
    ],
  );

  return { filter, extension };
}
