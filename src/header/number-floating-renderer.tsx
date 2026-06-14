import { Grid } from "lytenyte-pro";
import type { GridSpec } from "../types";
import { Popover } from "lytenyte-pro/components";
import { useEffect, useState } from "react";
import { NumberFilterPopoverContent } from "./number-filter-popover/number-filter-popover-content";
import { Tooltip } from "../ui/tooltip";

export function NumberFloatingRenderer({
  column,
  api,
}: Grid.T.HeaderParams<GridSpec>) {
  const filterModel = api.numberFilterModel.useValue();
  const operatorModel = api.numberOperatorModel.useValue();
  const setModel = api.numberSetModel.useValue();

  const hasFilter = !!(operatorModel[column.id] || setModel[column.id]);

  const [open, setOpen] = useState(false);

  const [ref, setRef] = useState<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!ref) return;
    ref.value = filterModel[column.id] ?? "";
  }, [filterModel, column.id, ref]);

  return (
    <div className="w-full h-full flex items-center gap-3">
      <Tooltip
        className="border border-gray-300 z-10"
        content={<div className="max-w-[500px]">{contentNumber}</div>}
        side="bottom"
      >
        <input
          data-ln-input
          disabled={hasFilter}
          ref={setRef}
          style={{
            height: 20,
            width: "calc(100% - 32px)",
            opacity: hasFilter ? 0.4 : undefined,
          }}
          onChange={(e) => {
            const val = e.target.value;
            api.numberFilterModel.set((prev) => {
              if (!val.trim()) {
                const next = { ...prev };
                delete next[column.id];
                return next;
              }
              return { ...prev, [column.id]: val };
            });
          }}
        />
      </Tooltip>
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          data-ln-button="secondary"
          data-ln-size="sm"
          className="relative"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentcolor"
            viewBox="0 0 256 256"
          >
            <path d="M230.6,49.53A15.81,15.81,0,0,0,216,40H40A16,16,0,0,0,28.19,66.76l.08.09L96,139.17V216a16,16,0,0,0,24.87,13.32l32-21.34A16,16,0,0,0,160,194.66V139.17l67.74-72.32.08-.09A15.8,15.8,0,0,0,230.6,49.53ZM40,56h0Zm106.18,74.58A8,8,0,0,0,144,136v58.66L112,216V136a8,8,0,0,0-2.16-5.47L40,56H216Z"></path>
          </svg>
          {hasFilter && (
            <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-(--ln-primary-50)" />
          )}
        </Popover.Trigger>
        <Popover.Container>
          <Popover.Arrow />
          <Popover.Title className="sr-only">Filter Column</Popover.Title>
          <Popover.Description className="sr-only">
            Filter configuration for {column.name ?? column.id}
          </Popover.Description>

          <NumberFilterPopoverContent column={column} api={api} />
        </Popover.Container>
      </Popover>
    </div>
  );
}

const mark = "font-mono bg-gray-300 px-2";
const contentNumber = (
  <div>
    Number expression filter supports logical operations such as{" "}
    <span className={mark}>{">, <, <=, >=, !=, ="}</span>. Filters may be
    combined using <span className={mark}>{"&& or ||"}</span>. For example:{" "}
    <span className={mark}>{`> 23 && < 45`}</span>.
  </div>
);
