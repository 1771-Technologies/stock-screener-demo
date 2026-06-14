"use client";
import { Grid } from "lytenyte-pro";
import { GridSpec } from "../types";
import { Dispatch, JSX, SetStateAction, useMemo, useState } from "react";
import { PillManager } from "lytenyte-pro/components";
import { tw } from "@/utils/tw";
import { AggMenu } from "../header/header-renderer/agg-menu";
import { GroupByColIcon } from "@1771technologies/lytenyte-core/icons";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Cross1Icon,
  GroupIcon,
} from "@radix-ui/react-icons";
import { IconButton } from "@/components/button/icon-button";

export function PillManagerVertical({
  api,
  columns,
  setColumns,
  grouped,
  setGrouped,
}: {
  api: Grid.API<GridSpec>;
  columns: Grid.Column<GridSpec>[];
  grouped: string[];
  setGrouped: Dispatch<SetStateAction<string[]>>;
  setColumns: Dispatch<SetStateAction<Grid.Column<GridSpec>[]>>;
}) {
  const [showGroups, setShowGroups] = useState(true);
  const [showAggregations, setShowAggs] = useState(true);

  const groupPills = useMemo(() => {
    // Find the active grouped rows.
    const active = grouped.map((x) => columns.find((c) => x === c.id)!);
    const inactive = columns.filter((x) => x.groupable && !active.includes(x));

    const activePills = active.map((x) => {
      return {
        id: x.id,
        active: true,
        movable: true,
        name: x.name ?? x.id,
        removable: false,
      } satisfies PillManager.T.PillItem;
    });
    const inactivePills = inactive.map((x) => {
      return {
        id: x.id,
        active: false,
        movable: true,
        name: x.name ?? x.id,
        removable: false,
      } satisfies PillManager.T.PillItem;
    });

    return [...activePills, ...inactivePills];
  }, [grouped, columns]);

  const pillRows = useMemo<PillManager.T.PillRow[]>(() => {
    return [
      {
        id: "groups",
        label: "Row Groups",
        type: "row-pivots",
        pills: groupPills,
        accepts: ["columns"],
      },
      {
        id: "aggregations",
        label: "Aggregations",
        type: "measures",
        pills: columns.map((x) => {
          return {
            active: true,
            id: x.id,
            name: x.name ?? x.id,
            movable: false,
            removable: false,
          } satisfies PillManager.T.PillItem;
        }),
      },
    ];
  }, [groupPills]);

  return (
    <PillManager
      orientation="vertical"
      rows={pillRows}
      onPillRowChange={(ev) => {
        for (const changed of ev.changed) {
          if (changed.id === "groups") {
            const activeFirst = changed.pills
              .filter((x) => x.active)
              .map((x) => x.id);

            setGrouped(activeFirst);
          }
        }
      }}
      onPillItemActiveChange={(params) => {
        // The active state of a row groups changed
        if (params.row.id === "groups") {
          setGrouped((prev) => {
            if (prev.includes(params.item.id))
              return prev.filter((x) => x !== params.item.id);
            return [...prev, params.item.id];
          });

          if (columns.find((x) => x.id === params.item.id)?.groupable)
            setColumns((prev) => {
              return prev.map((x) =>
                x.id === params.item.id
                  ? { ...x, hide: params.item.active }
                  : x,
              );
            });
        }
      }}
    >
      {(row) => {
        return (
          <PillManager.Row row={row}>
            <PillManager.Label
              style={{
                fontFamily: "var(--ln-typeface)",
              }}
              row={row}
              render={
                row.id === "groups" ? (
                  <div className="flex gap-1 items-center justify-between py-2 px-2 text-ln-gray-80">
                    <div className="flex gap-1 items-center text-sm">
                      <RowGroups />
                      Row Groups
                    </div>
                    <IconButton onClick={() => setShowGroups((prev) => !prev)}>
                      {showGroups ? (
                        <ChevronDownIcon className="size-4" />
                      ) : (
                        <ChevronRightIcon className="size-4" />
                      )}
                    </IconButton>
                  </div>
                ) : (
                  <div className="flex gap-1 items-center justify-between py-2 px-2 text-ln-gray-80">
                    <div className="flex gap-1 items-center text-sm font-[var(--ln-typeface)]">
                      <Measure />
                      Aggregations
                    </div>
                    <IconButton onClick={() => setShowAggs((prev) => !prev)}>
                      {showAggregations ? (
                        <ChevronDownIcon className="size-4" />
                      ) : (
                        <ChevronRightIcon className="size-4" />
                      )}
                    </IconButton>
                  </div>
                )
              }
            />
            {((row.id === "groups" && showGroups) ||
              (row.id === "aggregations" && showAggregations)) && (
              <PillManager.Container className="relative">
                {row.id === "groups" && row.pills.every((x) => !x.active) && (
                  <div className="absolute w-full top-[-10px] h-full flex items-center justify-center text-ln-gray-70">
                    <div className="flex flex-col justify-center items-center">
                      <EmptyIcon />
                      <div>Drag a column to group</div>
                    </div>
                  </div>
                )}
                {row.pills.map((pill) => {
                  const column = columns.find((x) => x.id === pill.id)!;

                  return (
                    <PillManager.Pill
                      className={tw(
                        row.id === "aggregations" &&
                          "flex items-center justify-between",
                        "text-ln-gray-100",
                        row.id === "groups" &&
                          !pill.active &&
                          "opacity-0 pointer-events-none",
                      )}
                      key={pill.id}
                      item={pill}
                      elementEnd={
                        row.id === "aggregations" ? (
                          <AggMenu
                            api={api}
                            column={column}
                            isNumber={column.type === "number"}
                          />
                        ) : (
                          <span className="flex-1 flex justify-end items-center text-ln-gray-70">
                            <Cross1Icon className="size-3" />
                          </span>
                        )
                      }
                    />
                  );
                })}
              </PillManager.Container>
            )}
          </PillManager.Row>
        );
      }}
    </PillManager>
  );
}

const RowGroups = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="16"
      height="16"
      stroke="currentcolor"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.5 3.75H17.203"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 9.56055H9.07178"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 15.4688H9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.8281L14.8284 12.8281L14.8284 9.9997"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.8286 15.6572L14.8286 12.8288L17.657 12.8288"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Measure = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15 6.25V4H5L10.7143 10L5 16H15V13.75"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const EmptyIcon = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.031 4.19995C15.031 2.95185 14.0192 1.94006 12.7711 1.94006L4.93315 1.94006C3.53893 1.94006 2.40869 3.0703 2.40869 4.46452L2.40869 12.1711C2.40869 13.4918 3.47927 14.5623 4.7999 14.5623"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeDasharray="0.13 3.16"
      />
      <path
        d="M15.8201 20.2441C15.3511 21.2413 13.9049 21.1542 13.559 20.108L11.3166 13.3263C11.0021 12.3749 11.9057 11.4712 12.8572 11.7858L19.6388 14.0281C20.6851 14.374 20.7722 15.8203 19.775 16.2893L17.4827 17.3674C17.2258 17.4882 17.0191 17.6949 16.8982 17.9518L15.8201 20.2441Z"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.6223 9.7091V8.52446C18.6223 7.13024 17.492 6 16.0978 6H8.52446C7.13024 6 6 7.13024 6 8.52445V16.0978C6 17.492 7.13024 18.6223 8.52446 18.6223H8.97731"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
