import {
  type FilterModelItem,
  type FilterNumber,
  type Column,
  type FilterString,
  type FilterCombination,
} from "@1771technologies/lytenyte-pro/types";
import { FilterNumberInput, FilterStringInput } from "./filter-inputs";
import type { Dispatch, SetStateAction } from "react";
import { unparseTextFilter } from "../parse-text-filters";
import { unparseNumberFilter } from "../parse-number-filters";
import { GridInput } from "../../ui/grid-input";
import { tw } from "../../lib/tw";

export interface SimpleFilterStringOrCombo {
  readonly column: Column<any>;
  readonly filter: Partial<FilterModelItem<any>> | null;
  readonly setFilter: Dispatch<
    SetStateAction<Partial<FilterModelItem<any>> | null>
  >;
  readonly hasIncompatibleQuickFilter: boolean;
}

export function SimpleFilterStringOrCombo({
  column,
  filter,
  setFilter,
  hasIncompatibleQuickFilter,
}: SimpleFilterStringOrCombo) {
  const filterType =
    filter?.kind || (column.type == "number" ? "number" : "string");

  if (filterType === "func" || filterType === "date") return null;

  if (hasIncompatibleQuickFilter) {
    return (
      <>
        <GridInput
          disabled
          value="Quick filter"
          className="disabled:text-ln-gray-60"
          onChange={() => {}}
        />
        <GridInput
          disabled
          value={
            column.type === "number"
              ? unparseNumberFilter(filter as any)
              : unparseTextFilter(filter! as FilterString)
          }
          className="disabled:text-ln-gray-60"
          onChange={() => {}}
        />
        <div className="md:col-span-2 text-ln-gray-70 -mt-1.5 text-xs">
          The quick filter applied can not be edited as a manual filter.
        </div>
      </>
    );
  }

  if (filterType === "string" || filterType === "number") {
    return (
      <SimpleFilter
        isRoot
        filter={filter as any}
        setFilter={setFilter as any}
        typeFallback={column.type === "number" ? "number" : "string"}
      />
    );
  }

  if (filterType === "combination") {
    const filterCombo = filter as FilterCombination;

    const first = filterCombo.filters[0] as FilterString | FilterNumber;
    const second = filterCombo.filters[1] as FilterString | FilterNumber;
    const typeFallback = column.type === "number" ? "number" : "string";

    return (
      <>
        <SimpleFilter
          filter={first}
          setFilter={(setter) => {
            const next = setter(first);

            const nextFilters = [...filterCombo.filters];
            nextFilters[0] = next as any;

            setFilter({ ...filterCombo, filters: nextFilters });
          }}
          typeFallback={typeFallback}
        />
        <div className="flex items-center justify-center gap-2 md:col-span-2">
          <div className="flex gap-1 items-center justify-end text-sm text-ln-gray-80">
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                checked={filterCombo.operator === "AND"}
                onChange={(e) => {
                  if (e.target.checked)
                    setFilter((prev) => ({ ...prev, operator: "AND" } as any));
                }}
                className={tw(
                  "appearance-none h-4 w-4 rounded-full border border-ln-gray-40 checked:border-ln-primary-50 checked:border-[5px] cursor-pointer select-none",
                  "focus-visible:outline focus-visible:outline-offset-1 focus-visible:outline-ln-primary-50"
                )}
              />
              And
            </label>
          </div>
          <div className="px-2 text-sm text-ln-gray-80">
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                checked={filterCombo.operator === "OR"}
                onChange={(e) => {
                  if (e.target.checked)
                    setFilter((prev) => ({ ...prev, operator: "OR" } as any));
                }}
                className={tw(
                  "appearance-none h-4 w-4 rounded-full border border-ln-gray-40 checked:border-ln-primary-50 checked:border-[5px] cursor-pointer select-none",
                  "focus-visible:outline focus-visible:outline-offset-1 focus-visible:outline-ln-primary-50"
                )}
              />
              Or
            </label>
          </div>
        </div>
        <SimpleFilter
          filter={second}
          setFilter={(setter) => {
            const next = setter(second);

            const nextFilters = [...filterCombo.filters];
            nextFilters[1] = next as any;

            setFilter({ ...filterCombo, filters: nextFilters });
          }}
          typeFallback={typeFallback}
        />
      </>
    );
  }

  return null;
}

type SimpleFilter =
  | Partial<FilterString>
  | Partial<FilterNumber>
  | Partial<FilterCombination>
  | null;

interface SimpleFilterProps {
  readonly isRoot?: boolean;
  readonly filter: SimpleFilter;
  readonly typeFallback: "number" | "string";
  readonly setFilter: (v: (prev: SimpleFilter) => SimpleFilter) => void;
}

function SimpleFilter({
  isRoot,
  filter,
  setFilter,
  typeFallback,
}: SimpleFilterProps) {
  const filterType = filter?.kind || typeFallback;

  if (filterType === "string") {
    const stringFilter = filter as Partial<FilterString> | null;

    return (
      <FilterStringInput
        filter={stringFilter}
        onValueChange={(v) => {
          setFilter((prev) => {
            const next = prev
              ? {
                  ...prev,
                  kind: "string",
                  value: v,
                  options: { caseInsensitive: true },
                }
              : {
                  kind: "string",
                  value: v,
                  options: { caseInsensitive: true },
                };

            if (isRoot) {
              if (next.operator && next.value) {
                return {
                  kind: "combination",
                  filters: [next],
                  operator: "AND",
                } as FilterCombination;
              }
            }

            return next as FilterString;
          });
        }}
        onOperatorChange={(v) => {
          setFilter((prev) => {
            const next = (
              prev
                ? {
                    ...prev,
                    kind: "string",
                    operator: v,
                    options: { caseInsensitive: true },
                  }
                : {
                    kind: "string",
                    operator: v,
                    options: { caseInsensitive: true },
                  }
            ) as FilterString;

            if (isRoot) {
              if (next.operator && next.value) {
                return {
                  kind: "combination",
                  filters: [next],
                  operator: "AND",
                } as FilterCombination;
              }
            }

            return next;
          });
        }}
      />
    );
  }

  if (filterType === "number") {
    const numberFilter = filter as Partial<FilterNumber> | null;

    return (
      <FilterNumberInput
        filter={numberFilter}
        onValueChange={(v) => {
          setFilter((prev) => {
            const next = prev
              ? { ...prev, kind: "number", value: v }
              : { kind: "number", value: v };

            if (isRoot) {
              if (next.operator && next.value != null) {
                return {
                  kind: "combination",
                  filters: [next],
                  operator: "AND",
                } as FilterCombination;
              }
            }

            return next as FilterNumber;
          });
        }}
        onOperatorChange={(v) => {
          setFilter((prev) => {
            const next = (
              prev
                ? { ...prev, kind: "number", operator: v }
                : { kind: "number", operator: v }
            ) as FilterNumber;

            if (isRoot) {
              if (next.operator && next.value) {
                return {
                  kind: "combination",
                  filters: [next],
                  operator: "AND",
                } as FilterCombination;
              }
            }

            return next as FilterNumber;
          });
        }}
      />
    );
  }

  return null;
}
