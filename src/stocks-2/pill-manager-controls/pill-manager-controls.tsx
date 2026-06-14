"use client";
import { Grid } from "lytenyte-pro";
import { GridSpec } from "../types";
import { Dispatch, SetStateAction, useMemo } from "react";
import { PillManager } from "lytenyte-pro/components";
import { AddMenu } from "./add-menu";
import { ExpandButton } from "./expand-button";
import { ColumnMenu } from "../column-menu/column-menu";
import { MoreVerticalIcon } from "@1771technologies/lytenyte-core/icons";
import { GridIconButton } from "../../components/icon-button";
import { tw } from "@/utils/tw";

export function PillManagerControls({
  api,
  columns,
  setColumns,
  grouped,
  setGrouped,
}: {
  api: Grid.API<GridSpec>;
  columns: Grid.Column<GridSpec>[];
  setColumns: Dispatch<SetStateAction<Grid.Column<GridSpec>[]>>;
  grouped: string[];
  setGrouped: Dispatch<SetStateAction<string[]>>;
}) {
  const visibleColumnPills = useMemo<PillManager.T.PillItem[]>(() => {
    return columns.map((x) => {
      return {
        id: x.id,
        active: !x.hide,
        movable: true,
        name: x.name ?? x.id,
        removable: false,
        data: x.id,
      } satisfies PillManager.T.PillItem;
    });
  }, [columns]);

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
        movable: false,
        name: x.name ?? x.id,
        removable: false,
      } satisfies PillManager.T.PillItem;
    });

    return [...activePills, ...inactivePills];
  }, [grouped, columns]);

  const pillRows = useMemo<PillManager.T.PillRow[]>(() => {
    return [
      {
        id: "column",
        label: "Columns",
        type: "columns",
        pills: visibleColumnPills,
        accepts: [],
      },
      {
        id: "groups",
        label: "Row Groups",
        type: "row-pivots",
        pills: groupPills,
        accepts: ["columns", "column"],
      },
    ];
  }, [visibleColumnPills, groupPills]);

  return (
    <PillManager
      rows={pillRows}
      onPillRowChange={(ev) => {
        for (const changed of ev.changed) {
          if (changed.id === "column") {
            setColumns((prev) => {
              const map = Object.fromEntries(prev.map((x) => [x.id, x]));
              return changed.pills.map((x) => ({
                ...map[x.id],
                hide: !x.active,
              }));
            });
          }
          if (changed.id === "groups") {
            const activeFirst = changed.pills
              .filter((x) => x.active)
              .map((x) => x.id);

            setGrouped(activeFirst);
          }
        }
      }}
      onPillItemActiveChange={(params) => {
        // The active state of columns changed
        if (params.row.id === "column") {
          setColumns((prev) => {
            return prev.map((x) => {
              if (x.id === params.item.id) return { ...x, hide: !x.hide };
              return x;
            });
          });
        }
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
            <PillManager.Label row={row} />
            <PillManager.Container>
              {row.pills.map((pill) => {
                if (row.id === "groups")
                  return <PillManager.Pill key={pill.id} item={pill} />;

                const column = columns.find((x) => x.id === pill.id)!;
                return (
                  <PillManager.Pill
                    key={pill.id}
                    item={pill}
                    elementEnd={
                      <ColumnMenu
                        api={api}
                        column={column}
                        isNumber={column.type === "number"}
                        className="opacity-100 hover:bg-ln-primary-10  relative top-0 left-[6px] bg-transparent backdrop-blur-none"
                      />
                    }
                  />
                );
              })}
            </PillManager.Container>
            <PillManager.Expander
              render={({ expanded, expandToggle }) => {
                return (
                  <div data-ln-pill-expander className="flex gap-1">
                    <AddMenu
                      row={row}
                      grouped={grouped}
                      setColumns={setColumns}
                      setGrouped={setGrouped}
                    />
                    <ExpandButton
                      expandToggle={expandToggle}
                      expanded={expanded}
                    />
                  </div>
                );
              }}
            />
          </PillManager.Row>
        );
      }}
    </PillManager>
  );
}
