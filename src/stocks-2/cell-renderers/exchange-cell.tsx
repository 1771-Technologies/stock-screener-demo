import { type JSX, memo } from "react";
import { tw } from "@/utils/tw";
import { Grid } from "lytenyte-pro";
import { GridSpec } from "../types";

function ExchangeCellImpl({
  api,
  row,
  column,
}: Grid.T.CellRendererParams<GridSpec>) {
  const exchange = api.columnField(column, row);
  if (api.rowIsGroup(row)) {
    return (
      <div
        className={tw(
          "px-3 flex items-center h-full text-nowrap",
          typeof exchange === "number" && "justify-end",
        )}
      >
        {exchange as number}
      </div>
    );
  }

  if (!exchange) return null;

  const Icon = exchange === "NYSE" ? NYSEIcon : NasdaqIcon;

  return (
    <div className="flex items-center gap-2 h-full w-full text-nowrap">
      <Icon className="rounded-full pointer-events-none" />
      <div>{`${exchange}`}</div>
    </div>
  );
}

export const ExchangeCells = memo(ExchangeCellImpl);

const NasdaqIcon = (props: JSX.IntrinsicElements["svg"]) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} {...props}>
    <path fill="#0090BA" d="M0 0h18v18H0z" />
    <path
      fill="#fff"
      d="M11.34 5.14h2.16l-2 5.53a.38.38 0 0 1-.36.25H9.02a.38.38 0 0 0 .32-.25l2-5.53Zm-2.5 5.7a.36.36 0 0 1-.33-.22l-.43-1.19.74-2.03a.36.36 0 0 1 .68-.02l.43 1.19-.74 2.03a.36.36 0 0 1-.34.24ZM9 7.08c-.16 0-.29.1-.34.25l-2 5.53H4.5l2-5.53c.06-.15.2-.25.36-.25H9Z"
    />
  </svg>
);

const NYSEIcon = (props: JSX.IntrinsicElements["svg"]) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} {...props}>
    <path fill="url(#a)" d="M0 0h18v18H0z" />
    <path fill="#71C5E7" d="M4 7.33h6.67V14H14V4H4v3.33Z" />
    <defs>
      <linearGradient
        id="a"
        x1={3.35}
        x2={21.9}
        y1={3.12}
        y2={24.43}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#1A1E21" />
        <stop offset={1} stopColor="#06060A" />
      </linearGradient>
    </defs>
  </svg>
);
