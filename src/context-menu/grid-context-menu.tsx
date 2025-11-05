import type { Grid, PositionUnion } from "@1771technologies/lytenyte-pro/types";
import { ContextMenu as CM } from "radix-ui";
import { Item, Separator, SubTrigger } from "./item";
import {
  AutosizeIcon,
  Columns2Icon,
  CopyIcon,
  CsvIcon,
  DownloadIcon,
  ExcelIcon,
  GroupByColIcon,
  SortIcon,
  SpacingHIcon,
  SpacingIcon,
} from "@1771technologies/lytenyte-pro/icons";
import { tw } from "../lib/tw";
import { downloadBlob } from "../download-file";
import { getExcelFile } from "../excel-export";

export function GridContextMenu({
  grid,
  position,
}: {
  grid: Grid<any>;
  position: PositionUnion | null;
}) {
  const base = grid.state.columnBase.useValue();
  const column = grid.api.columnByIndex(position?.colIndex ?? -1);

  const isGroupable =
    column?.uiHints?.rowGroupable ?? base.uiHints?.rowGroupable ?? false;

  const disableReason = isGroupable
    ? null
    : `The ${column?.name ?? column?.id} column cannot be used as a row group.`;

  return (
    <CM.Portal>
      <CM.Content
        className={tw(
          "bg-ln-gray-05 border-ln-gray-30 border z-50 rounded relative"
        )}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Item
          icon={<CopyIcon />}
          label={"Copy"}
          onClick={async () => {
            const selection = grid.state.cellSelections.get().at(-1);
            if (!selection) return;

            const csv = await grid.api.exportCsv({
              dataRect: selection,
              includeHeader: false,
              delimiter: "\t",
            });

            grid.state.viewport.get()?.classList.add("cell-copy");
            setTimeout(() => {
              grid.state.viewport.get()?.classList.remove("cell-copy");
            }, 200);

            await navigator.clipboard.writeText(csv);
          }}
        />
        <Item
          icon={<CopyIcon />}
          onClick={async () => {
            const selection = grid.state.cellSelections.get().at(-1);
            if (!selection) return;

            const csv = await grid.api.exportCsv({
              dataRect: selection,
              includeHeader: true,
              delimiter: "\t",
            });

            grid.state.viewport.get()?.classList.add("cell-copy");
            setTimeout(() => {
              grid.state.viewport.get()?.classList.remove("cell-copy");
            }, 200);

            await navigator.clipboard.writeText(csv);
          }}
          label={
            <div className="flex items-center gap-1">
              Copy
              <span className="text-xs text-ln-gray-60">(With Headers)</span>
            </div>
          }
        />
        <Separator />

        <CM.ContextMenuSub>
          <SubTrigger icon={<DownloadIcon />} label="Export" />
          <CM.Portal>
            <CM.ContextMenuSubContent
              className="bg-ln-gray-05 border-ln-gray-30 border z-50 rounded"
              sideOffset={1}
              alignOffset={-8}
            >
              <Item
                icon={<CsvIcon />}
                label="CSV Export"
                onClick={() => {
                  const selection = grid.state.cellSelections.get().at(-1);
                  if (!selection) return;

                  grid.api
                    .exportCsvFile({
                      dataRect: selection,
                      includeHeader: false,
                    })
                    .then((file) => {
                      downloadBlob(file, "stock-screener-selection.csv");
                    });
                }}
              />
              <Item
                icon={<CsvIcon />}
                label="CSV Export (with headers)"
                onClick={() => {
                  const selection = grid.state.cellSelections.get().at(-1);
                  if (!selection) return;

                  grid.api
                    .exportCsvFile({
                      dataRect: selection,
                      includeHeader: true,
                    })
                    .then((file) => {
                      downloadBlob(file, "stock-screener-selection.csv");
                    });
                }}
              />
              <Item
                icon={<ExcelIcon />}
                label="Excel Export"
                onClick={async () => {
                  const selection = grid.state.cellSelections.get().at(-1);
                  if (!selection) return;

                  const data = await grid.api.exportDataRect({
                    dataRect: selection,
                  });

                  const file = await getExcelFile(data);

                  downloadBlob(file, "stock-screen-selection.xlsx");
                }}
              />
            </CM.ContextMenuSubContent>
          </CM.Portal>
        </CM.ContextMenuSub>

        <Separator />

        {column && (
          <Item
            icon={<AutosizeIcon className="size-4" />}
            onClick={() => grid.api.columnAutosize({ columns: [column] })}
            label={
              <div className="flex items-center gap-1">
                Autosize{" "}
                <span className="text-ln-gray-90 font-bold">
                  {column.name ?? column.id}
                </span>
              </div>
            }
          />
        )}
        <Item
          onClick={() => grid.api.columnAutosize({})}
          icon={<SpacingIcon />}
          label="Autosize All Columns"
        />
        <Item
          onClick={() => grid.api.columnAutosize({ includeHeader: true })}
          icon={<SpacingHIcon />}
          label="Autosize All (Include Headers)"
        />

        <Separator />
        {column && (
          <Item
            disabled={!isGroupable}
            disableReason={disableReason}
            icon={<GroupByColIcon />}
            onClick={() => {
              grid.state.rowGroupModel.set((prev) => {
                if (prev.includes(column.id)) return prev;

                return [...prev, column.id];
              });
              grid.api.columnUpdate({ [column.id]: { hide: true } });
            }}
            label={
              <div>
                Group By{" "}
                <span
                  className={tw(isGroupable && "text-ln-gray-90 font-bold")}
                >
                  {" "}
                  {column.name ?? column.id}
                </span>
              </div>
            }
          />
        )}

        <Separator />
        <Item
          label="Manage Columns"
          icon={<Columns2Icon />}
          onClick={() => grid.api.dialogFrameOpen("column-manager")}
        />
        <Item
          label="Manage Sorts"
          icon={<SortIcon />}
          onClick={() => grid.api.dialogFrameOpen("sort-manager")}
        />
      </CM.Content>
    </CM.Portal>
  );
}
