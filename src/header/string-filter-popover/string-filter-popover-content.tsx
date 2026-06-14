"use client";
import { Grid } from "lytenyte-pro";
import { Popover } from "lytenyte-pro/components";
import { useMemo, useState } from "react";
import type { GridSpec } from "../../types";
import type {
  FilterString,
  StringColumnFilter,
} from "../../filters/string-operator-filter";
import { ExpressionFilterPlaceholder } from "./expression-filter-placeholder";
import { SimpleStringFilter } from "./simple-string-filter";
import { SetFilter } from "./string-set-filter";

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

export function StringFilterPopoverContent({ column, api }: Props) {
  const committedOperator = api.stringOperatorModel.useValue();
  const committedSet = api.stringSetModel.useValue();
  const expressionFilter = api.stringFilterModel.useValue()[column.id] ?? null;

  const allValues = useMemo(
    () => api.getColumnValues(column.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.id],
  );

  const [tempLeft, setTempLeft] = useState<Partial<FilterString>>(() => {
    const entry = committedOperator[column.id];
    return entry?.left ?? {};
  });

  const [tempRight, setTempRight] = useState<Partial<FilterString>>(() => {
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
    api.stringFilterModel.set((prev: Record<string, string>) => {
      const next = { ...prev };
      delete next[column.id];
      return next;
    });
  }

  function handleClear() {
    clearExpressionFilter();
    api.stringOperatorModel.set((prev: Record<string, StringColumnFilter>) => {
      const next = { ...prev };
      delete next[column.id];
      return next;
    });
    api.stringSetModel.set(
      (prev: Record<string, Grid.T.RowSelectionLinked>) => {
        const next = { ...prev };
        delete next[column.id];
        return next;
      },
    );
  }

  function handleApply() {
    // Clear expression filter — operator/set filter takes precedence
    clearExpressionFilter();

    // Commit operator filter
    const leftValid = !!(tempLeft.operator && tempLeft.value?.trim());
    const rightValid = !!(tempRight.operator && tempRight.value?.trim());

    if (leftValid || rightValid) {
      // If first is empty but second has a value, promote second to first slot.
      const effectiveLeft = leftValid
        ? { operator: tempLeft.operator!, value: tempLeft.value! }
        : { operator: tempRight.operator!, value: tempRight.value! };
      const effectiveRight =
        leftValid && rightValid
          ? { operator: tempRight.operator!, value: tempRight.value! }
          : null;

      const filter: StringColumnFilter = {
        left: effectiveLeft,
        right: effectiveRight,
        operator: tempCombinator,
      };
      api.stringOperatorModel.set(
        (prev: Record<string, StringColumnFilter>) => ({
          ...prev,
          [column.id]: filter,
        }),
      );
    } else {
      api.stringOperatorModel.set(
        (prev: Record<string, StringColumnFilter>) => {
          const next = { ...prev };
          delete next[column.id];
          return next;
        },
      );
    }

    // Commit set filter
    if (allSelected) {
      api.stringSetModel.set(
        (prev: Record<string, Grid.T.RowSelectionLinked>) => {
          const next = { ...prev };
          delete next[column.id];
          return next;
        },
      );
    } else {
      api.stringSetModel.set(
        (prev: Record<string, Grid.T.RowSelectionLinked>) => ({
          ...prev,
          [column.id]: setToRowSelection(tempSelected, allValues),
        }),
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
        <SimpleStringFilter
          tempLeft={tempLeft}
          tempRight={tempRight}
          tempCombinator={tempCombinator}
          setTempLeft={setTempLeft}
          setTempRight={setTempRight}
          setTempCombinator={setTempCombinator}
        />
      )}

      <SetFilter
        allValues={allValues}
        setTempSelected={setTempSelected}
        tempSelected={tempSelected}
      />

      {/* Footer */}
      <div className="flex justify-end gap-2  pt-2">
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
