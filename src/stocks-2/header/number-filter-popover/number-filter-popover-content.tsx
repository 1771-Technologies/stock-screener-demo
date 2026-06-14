"use client";
import { Grid } from "lytenyte-pro";
import { Popover } from "lytenyte-pro/components";
import { useMemo, useState } from "react";
import { GridSpec } from "../../types";
import {
  FilterNumber,
  NumberColumnFilter,
} from "../../filters/number-operator-filter";
import { ExpressionFilterPlaceholder } from "../string-filter-popover/expression-filter-placeholder";
import { SimpleNumberFilter } from "./simple-number-filter";
import { NumberSetFilter } from "./number-set-filter";

function rowSelectionToSet(
  state: Grid.T.RowSelectionLinked,
  allValues: string[],
): Set<string> {
  const selected = new Set<string>();
  for (const v of allValues) {
    const child = state.children.get(v);
    const isSelected =
      child?.selected !== undefined ? child.selected : state.selected;
    if (isSelected) selected.add(v);
  }
  return selected;
}

function setToRowSelection(
  selected: Set<string>,
  allValues: string[],
): Grid.T.RowSelectionLinked {
  if (selected.size === 0) {
    return { kind: "linked", selected: false, children: new Map() };
  }
  if (selected.size === allValues.length) {
    return { kind: "linked", selected: true, children: new Map() };
  }
  const children = new Map<string, Grid.T.RowSelectNode>();
  for (const v of allValues) {
    if (!selected.has(v)) {
      children.set(v, { id: v, selected: false });
    }
  }
  return { kind: "linked", selected: true, children };
}

interface Props {
  column: Grid.Column<GridSpec>;
  api: GridSpec["api"];
}

export function NumberFilterPopoverContent({ column, api }: Props) {
  const committedOperator = api.numberOperatorModel.useValue();
  const committedSet = api.numberSetModel.useValue();
  const expressionFilter = api.numberFilterModel.useValue()[column.id] ?? null;

  const allValues = useMemo(
    () => api.getColumnValues(column.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.id],
  );

  const [tempLeft, setTempLeft] = useState<Partial<FilterNumber>>(() => {
    const entry = committedOperator[column.id];
    return entry?.left ?? {};
  });

  const [tempRight, setTempRight] = useState<Partial<FilterNumber>>(() => {
    const entry = committedOperator[column.id];
    return entry?.right ?? {};
  });

  const [tempCombinator, setTempCombinator] = useState<"AND" | "OR">(() => {
    return committedOperator[column.id]?.operator ?? "AND";
  });

  const [tempSelected, setTempSelected] = useState<Set<string>>(() => {
    const entry = committedSet[column.id];
    if (!entry) return new Set(allValues);
    return rowSelectionToSet(entry, allValues);
  });

  const allSelected = tempSelected.size === allValues.length;

  function clearExpressionFilter() {
    api.numberFilterModel.set((prev: Record<string, string>) => {
      const next = { ...prev };
      delete next[column.id];
      return next;
    });
  }

  function handleClear() {
    clearExpressionFilter();
    api.numberOperatorModel.set((prev: Record<string, NumberColumnFilter>) => {
      const next = { ...prev };
      delete next[column.id];
      return next;
    });
    api.numberSetModel.set(
      (prev: Record<string, Grid.T.RowSelectionLinked>) => {
        const next = { ...prev };
        delete next[column.id];
        return next;
      },
    );
  }

  function handleApply() {
    clearExpressionFilter();

    // Commit set filter
    if (allSelected) {
      api.numberSetModel.set(
        (prev: Record<string, Grid.T.RowSelectionLinked>) => {
          const next = { ...prev };
          delete next[column.id];
          return next;
        },
      );
    } else {
      api.numberSetModel.set(
        (prev: Record<string, Grid.T.RowSelectionLinked>) => ({
          ...prev,
          [column.id]: setToRowSelection(tempSelected, allValues),
        }),
      );
    }

    // Commit operator filter — promote second to first if first is empty
    const leftValid = !!(
      tempLeft.operator &&
      tempLeft.value != null &&
      !Number.isNaN(tempLeft.value)
    );
    const rightValid = !!(
      tempRight.operator &&
      tempRight.value != null &&
      !Number.isNaN(tempRight.value)
    );

    if (leftValid || rightValid) {
      const effectiveLeft = leftValid
        ? { operator: tempLeft.operator!, value: tempLeft.value! }
        : { operator: tempRight.operator!, value: tempRight.value! };
      const effectiveRight =
        leftValid && rightValid
          ? { operator: tempRight.operator!, value: tempRight.value! }
          : null;

      const filter: NumberColumnFilter = {
        left: effectiveLeft,
        right: effectiveRight,
        operator: tempCombinator,
      };
      api.numberOperatorModel.set(
        (prev: Record<string, NumberColumnFilter>) => ({
          ...prev,
          [column.id]: filter,
        }),
      );
    } else {
      api.numberOperatorModel.set(
        (prev: Record<string, NumberColumnFilter>) => {
          const next = { ...prev };
          delete next[column.id];
          return next;
        },
      );
    }
  }

  return (
    <div
      className="min-w-[300px] max-w-[400px] flex flex-col gap-3"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <ExpressionFilterPlaceholder expressionFilter={expressionFilter} />
      {!expressionFilter && (
        <SimpleNumberFilter
          tempLeft={tempLeft}
          tempRight={tempRight}
          tempCombinator={tempCombinator}
          setTempLeft={setTempLeft}
          setTempRight={setTempRight}
          setTempCombinator={setTempCombinator}
        />
      )}

      <NumberSetFilter
        allValues={allValues}
        tempSelected={tempSelected}
        setTempSelected={setTempSelected}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Popover.Close
          onClick={handleClear}
          data-ln-button="tertiary"
          className="bg-ln-gray-02 px-4"
        >
          Clear
        </Popover.Close>
        <Popover.Close
          onClick={handleApply}
          data-ln-button="primary"
          className="px-4"
        >
          Apply
        </Popover.Close>
      </div>
    </div>
  );
}
