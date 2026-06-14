import { Grid } from "lytenyte-pro";
import { memo, type ReactNode } from "react";
import type { GridSpec } from "../types";
import { tw } from "../lib/tw";

function AnalystRatingCellImpl({
  api,
  row,
  column,
}: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row) as string;

  let Icon: (() => ReactNode) | null = null;
  const label = field || "-";
  let clx = "ln-gray-50";
  if (label === "Strong buy") {
    Icon = StrongBuy;
    clx = "text-[var(--ln-green-50)]";
  } else if (label === "Strong Sell") {
    Icon = StrongSell;
    clx = "text-[var(--ln-red-50)]";
  } else if (label === "Neutral") {
    Icon = Minus;
  } else if (label === "Buy") {
    Icon = Buy;
    clx = "text-[var(--ln-green-50)]";
  } else if (label === "Sell") {
    Icon = Sell;
    clx = "text-[var(--ln-red-50)]";
  }

  const activeAgg = column.agg;
  const isCount = row.kind === "branch" && activeAgg === "count";
  const isGroupRow = api.rowIsGroup(row);

  return (
    <div
      className={tw(
        "items-center h-full gap-4 grid grid-cols-[16px_1fr] text-nowrap",
        clx,
        isGroupRow && isCount && "flex justify-end",
      )}
    >
      {Icon && <Icon />}
      <div>
        {label}
        {isCount && <span className="pl-1">Ratings</span>}
      </div>
    </div>
  );
}

function Minus() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={16}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

function Sell() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={16}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

function Buy() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={16}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 15.75 7.5-7.5 7.5 7.5"
      />
    </svg>
  );
}

function StrongSell() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={16}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
      />
    </svg>
  );
}

function StrongBuy() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={16}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 18.75 7.5-7.5 7.5 7.5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 7.5-7.5 7.5 7.5"
      />
    </svg>
  );
}

export const AnalystRatingCell = memo(AnalystRatingCellImpl);
