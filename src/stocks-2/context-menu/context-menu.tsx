import "./context-menu.css";

import { Grid } from "lytenyte-pro";
import { Menu } from "lytenyte-pro/components";
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
} from "@1771technologies/lytenyte-core/icons";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction } from "react";
import { GridSpec } from "../types";
import { getCsvFile } from "../export-data/csv-export";
import { getExcelFile } from "../export-data/excel-export";
import { downloadBlob } from "../export-data/download-file";

type MenuState = null | {
  row: Grid.T.RowNode<GridSpec["data"]> | null;
  column: Grid.Column<GridSpec>;
};

interface Props {
  api: Grid.API<GridSpec>;
  anchor: Grid.T.VirtualTarget | null;
  menu: MenuState;
  setMenu: Dispatch<SetStateAction<MenuState>>;
  setAnchor: Dispatch<SetStateAction<Grid.T.VirtualTarget | null>>;
}

function flash(api: Grid.API<GridSpec>) {
  const viewport = api.viewport$.get();
  if (!viewport) return;

  viewport.classList.add("copy-flash");

  setTimeout(() => viewport.classList.remove("copy-flash"), 500);
}

export function ContextMenu(props: Props) {
  if (!props.api) return;

  return <ContextMenuImpl {...props} />;
}

export function ContextMenuImpl({
  api,
  anchor,
  menu,
  setMenu,
  setAnchor,
}: Props) {
  function close() {
    setAnchor(null);
    setMenu(null);
  }

  async function copy(includeHeaders: boolean) {
    const [sel] = api.cellSelections();
    if (!sel) return;
    const data = await api.exportData({ rect: sel });
    const rows: string[] = [];
    if (includeHeaders) rows.push(data.headers.join("\t"));
    for (const row of data.data) {
      rows.push(row.map((c) => (c == null ? "" : String(c))).join("\t"));
    }
    flash(api);
    await navigator.clipboard.writeText(rows.join("\n"));
  }

  async function exportCsv(includeHeaders: boolean) {
    const [sel] = api.cellSelections();
    const data = await api.exportData(sel ? { rect: sel } : undefined);
    downloadBlob(getCsvFile(data, includeHeaders), "stock-screener.csv");
  }

  async function exportExcel() {
    const [sel] = api.cellSelections();
    const data = await api.exportData(sel ? { rect: sel } : undefined);
    downloadBlob(await getExcelFile(data), "stock-screener.xlsx");
  }

  const column = menu?.column;
  const isGroupable = column?.groupable ?? false;
  const grouped = api.grouped.get() ?? [];
  const isAlreadyGrouped = column ? grouped.includes(column.id) : false;

  return (
    <Menu
      anchor={anchor}
      open={!!menu}
      modal={false}
      lockScroll
      lightDismiss
      focusTrap={false}
      onOpenChange={(b) => {
        if (!b) close();
      }}
    >
      <Menu.Popover>
        <Menu.Container>
          {/* Copy */}
          <Menu.Item onAction={() => copy(false)} className="flex gap-2">
            <CopyIcon /> Copy
          </Menu.Item>
          <Menu.Item onAction={() => copy(true)} className="flex gap-2">
            <CopyIcon />
            <span>
              Copy <span className="text-ln-gray-60">(With Headers)</span>
            </span>
          </Menu.Item>

          <Menu.Divider className="my-1 border-t border-ln-gray-40" />

          {/* Export submenu */}
          <Menu.Submenu>
            <Menu.SubmenuTrigger className="flex justify-between">
              <span className="flex items-center gap-2">
                <DownloadIcon /> Export
              </span>
              <ChevronRightIcon />
            </Menu.SubmenuTrigger>
            <Menu.SubmenuContainer>
              <Menu.Item
                onAction={() => exportCsv(false)}
                className="flex gap-2"
              >
                <CsvIcon /> CSV Export
              </Menu.Item>
              <Menu.Item
                onAction={() => exportCsv(true)}
                className="flex gap-2"
              >
                <CsvIcon />
                <span>
                  CSV Export{" "}
                  <span className="text-ln-gray-60">(with headers)</span>
                </span>
              </Menu.Item>
              <Menu.Item onAction={() => exportExcel()} className="flex gap-2">
                <ExcelIcon /> Excel Export
              </Menu.Item>
            </Menu.SubmenuContainer>
          </Menu.Submenu>

          <Menu.Divider className="my-1 border-t border-ln-gray-40" />

          {/* Autosize */}
          {column && (
            <Menu.Item
              onAction={() => api.columnAutosize({ columns: [column] })}
              className="flex gap-2"
            >
              <AutosizeIcon />
              <span>
                Autosize <strong>{column.name ?? column.id}</strong>
              </span>
            </Menu.Item>
          )}
          <Menu.Item
            onAction={() => api.columnAutosize()}
            className="flex gap-2"
          >
            <SpacingIcon /> Autosize All Columns
          </Menu.Item>
          <Menu.Item
            onAction={() => api.columnAutosize({ includeHeader: true })}
            className="flex gap-2"
          >
            <SpacingHIcon /> Autosize All (Include Headers)
          </Menu.Item>

          <Menu.Divider className="my-1 border-t border-ln-gray-40" />

          {/* Group By */}
          {column && isAlreadyGrouped && (
            <Menu.Item
              onAction={() =>
                api.grouped.set(grouped.filter((id) => id !== column.id))
              }
              className="flex gap-2"
            >
              <GroupByColIcon />
              <span>
                Remove Group <strong>{column.name ?? column.id}</strong>
              </span>
            </Menu.Item>
          )}
          {column && !isAlreadyGrouped && (
            <Menu.Item
              disabled={!isGroupable}
              onAction={() => {
                api.grouped.set([...grouped, column.id]);
                api.columnUpdate({ [column.id]: { hide: true } });
              }}
              className="flex gap-2"
            >
              <GroupByColIcon />
              <span>
                Group By <strong>{column.name ?? column.id}</strong>
              </span>
            </Menu.Item>
          )}

          <Menu.Divider className="my-1 border-t border-ln-gray-40" />

          {/* Manage */}
          <Menu.Item
            onAction={() => api.columnManagerOpen.set(true)}
            className="flex gap-2"
          >
            <Columns2Icon /> Manage Columns
          </Menu.Item>
          <Menu.Item
            onAction={() => api.sortManagerOpen.set(true)}
            className="flex gap-2"
          >
            <SortIcon /> Manage Sorts
          </Menu.Item>
        </Menu.Container>
      </Menu.Popover>
    </Menu>
  );
}
