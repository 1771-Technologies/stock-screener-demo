"use client";
import { Grid } from "lytenyte-pro";
import { Dialog, SmartSelect } from "lytenyte-pro/components";
import { useMemo, useState } from "react";
import { GridSpec } from "../types";
import { SortEntry } from "./sort-types";
import { getSortOnOptionsForType, SortOnOption } from "./sort-on-options";
import { tw } from "@/utils/tw";

const groupSort = { id: "__ln_group__", label: "Group" };

const ORDER_OPTIONS = [
  { id: "asc", label: "Asc" },
  { id: "desc", label: "Desc" },
] as const;

const ChevronIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    fill="currentColor"
    viewBox="0 0 256 256"
    className="shrink-0"
  >
    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentcolor"
    viewBox="0 0 256 256"
  >
    <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
  </svg>
);

const AddIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentcolor"
    viewBox="0 0 256 256"
  >
    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
  </svg>
);

function ColSelect({
  value,
  options,
  onChange,
  placeholder = "Select...",
  disabled = false,
}: {
  value: { id: string; label: string } | null;
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <SmartSelect
      kind="basic"
      value={value}
      options={options}
      onOptionChange={(v) => v && onChange(v.id)}
      container={
        <SmartSelect.Container
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--ln-gray-50) transparent",
          }}
          className="max-h-60 overflow-auto z-50 bg-ln-gray-05 border border-ln-gray-30 rounded-md shadow-md"
        />
      }
      trigger={
        <SmartSelect.BasicTrigger
          data-ln-input
          disabled={disabled}
          className="flex w-full items-center justify-between gap-1 text-xs truncate disabled:opacity-50"
          style={{ height: 32 }}
        >
          <span className="truncate">{value?.label ?? placeholder}</span>
          <ChevronIcon />
        </SmartSelect.BasicTrigger>
      }
    >
      {(p) => (
        <SmartSelect.Option
          {...p}
          className={tw(
            "flex items-center px-2 py-1.5 text-xs cursor-pointer",
            "hover:bg-ln-primary-20 focus-visible:bg-ln-primary-20",
            p.selected && "text-ln-primary-50",
          )}
        >
          {p.option.label}
        </SmartSelect.Option>
      )}
    </SmartSelect>
  );
}

interface Props {
  columns: Grid.Column<GridSpec>[];
  sortModel: SortEntry[];
  onApply: (model: SortEntry[]) => void;
  onClear: () => void;
  onClose: () => void;
}

export function SortDialogContent({
  columns,
  sortModel,
  onApply,
  onClear,
  onClose,
}: Props) {
  const [tempModel, setTempModel] = useState<SortEntry[]>(() =>
    sortModel.length > 0
      ? sortModel
      : [
          {
            id: crypto.randomUUID(),
            columnId: null,
            descending: false,
            sortOnId: "values",
          },
        ],
  );

  const columnOptions = useMemo(
    () => columns.map((c) => ({ id: c.id, label: c.name ?? c.id })),
    [columns],
  );

  const columnTypeMap = useMemo(
    () => Object.fromEntries(columns.map((c) => [c.id, c.type])),
    [columns],
  );

  const atMax = tempModel.length >= columns.length;

  function updateRow(index: number, patch: Partial<SortEntry>) {
    setTempModel((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const next = { ...row, ...patch };
        // Reset sortOnId when column changes if the current option isn't valid for the new type
        if (patch.columnId !== undefined && patch.columnId !== row.columnId) {
          const newType = patch.columnId
            ? columnTypeMap[patch.columnId]
            : undefined;
          const validIds = getSortOnOptionsForType(newType).map((o) => o.id);
          if (!validIds.includes(next.sortOnId)) next.sortOnId = "values";
        }
        return next;
      }),
    );
  }

  function addRow() {
    if (atMax) return;
    setTempModel((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        columnId: null,
        descending: false,
        sortOnId: "values",
      },
    ]);
  }

  function removeRow(index: number) {
    setTempModel((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0
        ? next
        : [
            {
              id: crypto.randomUUID(),
              columnId: null,
              descending: false,
              sortOnId: "values",
            },
          ];
    });
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ln-gray-30 px-4 pb-3">
        <Dialog.Title className="text-base font-semibold">Sort</Dialog.Title>
        <Dialog.Close data-ln-button="secondary" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
          </svg>
        </Dialog.Close>
      </div>
      {/* Sort rows — subgrid on desktop, stacked on mobile */}
      <div className="flex flex-col md:grid md:grid-cols-[1fr_1fr_100px_auto_auto] max-h-[60vh] px-[18px] py-[12px] overflow-y-auto">
        {/* Column headers — desktop only */}
        <div className="hidden md:grid md:grid-cols-subgrid md:col-span-full pt-2 pb-1 text-xs text-ln-gray-70 font-semibold">
          <div className="pl-2">Column</div>
          <div className="pl-2">Sort On</div>
          <div className="pl-2">Order</div>
        </div>

        {tempModel.map((row, i) => {
          const usedIds = new Set(
            tempModel
              .filter((_, j) => j !== i)
              .map((e) => e.columnId)
              .filter(Boolean) as string[],
          );
          const availableColumns = columnOptions.filter(
            (o) => !usedIds.has(o.id),
          );

          const selectedColumn =
            row.columnId === "__ln_group__"
              ? groupSort
              : (columnOptions.find((o) => o.id === row.columnId) ?? null);

          const colType = row.columnId
            ? columnTypeMap[row.columnId]
            : undefined;
          const sortOnOptions: SortOnOption[] =
            getSortOnOptionsForType(colType);
          const selectedSortOn =
            sortOnOptions.find((o) => o.id === row.sortOnId) ??
            sortOnOptions[0];
          const selectedOrder =
            ORDER_OPTIONS.find((o) =>
              row.descending ? o.id === "desc" : o.id === "asc",
            ) ?? ORDER_OPTIONS[0];
          const orderOptions = ORDER_OPTIONS as unknown as {
            id: string;
            label: string;
          }[];

          return (
            <div
              key={row.id}
              className="flex flex-col md:grid md:grid-cols-subgrid md:col-span-full gap-2 items-center py-2 px-0.5 rounded"
            >
              {/* Column select */}
              <div className="w-full">
                <ColSelect
                  value={selectedColumn}
                  options={availableColumns}
                  onChange={(id) => updateRow(i, { columnId: id })}
                />
              </div>

              {/* Sort On select */}
              <div className="w-full">
                <ColSelect
                  value={selectedSortOn}
                  options={sortOnOptions}
                  onChange={(id) => updateRow(i, { sortOnId: id })}
                  placeholder="Sort on..."
                  disabled={!row.columnId}
                />
              </div>

              {/* Order — desktop only (combined with buttons on mobile) */}
              <div className="hidden md:block w-full">
                <ColSelect
                  value={selectedOrder}
                  options={orderOptions}
                  onChange={(id) => updateRow(i, { descending: id === "desc" })}
                />
              </div>

              {/* Mobile: Order + buttons in one row */}
              <div className="flex md:hidden w-full gap-2">
                <div className="flex-1">
                  <ColSelect
                    value={selectedOrder}
                    options={orderOptions}
                    onChange={(id) =>
                      updateRow(i, { descending: id === "desc" })
                    }
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button
                    data-ln-button="tertiary"
                    onClick={addRow}
                    disabled={atMax}
                    aria-label="Add sort"
                    className="flex items-center justify-center disabled:opacity-40"
                  >
                    <AddIcon />
                  </button>
                  <button
                    data-ln-button="tertiary"
                    onClick={() => removeRow(i)}
                    aria-label="Remove sort"
                    className="flex items-center justify-center"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>

              {/* Desktop: buttons */}
              <div className="hidden w-full justify-end md:flex items-center">
                <button
                  data-ln-button="secondary"
                  data-ln-size="sm"
                  onClick={addRow}
                  disabled={atMax}
                  aria-label="Add sort"
                  className="flex items-center justify-center disabled:opacity-40"
                >
                  <AddIcon />
                </button>
                <button
                  data-ln-button="secondary"
                  data-ln-size="sm"
                  onClick={() => removeRow(i)}
                  aria-label="Remove sort"
                  className="flex items-center justify-center"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-[18px] border-t border-ln-gray-30 pt-4">
        <div className="flex-1">
          <button
            data-ln-button="tertiary"
            data-ln-size="sm"
            className="w-[80px]"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
        <button
          data-ln-button="tertiary"
          data-ln-size="sm"
          className="w-[80px]"
          onClick={() => {
            onClear();
            onClose();
          }}
        >
          Clear
        </button>
        <button
          data-ln-button="primary"
          data-ln-size="sm"
          onClick={() => {
            onApply(tempModel.filter((e) => e.columnId !== null));
            onClose();
          }}
          className="w-[80px] btn-primary"
        >
          Apply
        </button>
      </div>
    </>
  );
}
