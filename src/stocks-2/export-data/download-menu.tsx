import { Button } from "@/components/button/button";
import { tw } from "@/utils/tw";
import {
  CsvIcon,
  DownloadIcon,
  ExcelIcon,
} from "@1771technologies/lytenyte-core/icons";
import { Grid } from "lytenyte-pro";
import { Menu } from "lytenyte-pro/components";
import { GridSpec } from "../types";
import { getCsvFile } from "./csv-export";
import { downloadBlob } from "./download-file";
import { getExcelFile } from "./excel-export";

export function DownloadMenu({
  api,
  theme,
}: {
  api: Grid.API<GridSpec> | null;
  theme: string;
}) {
  return (
    <Menu>
      <Menu.Trigger
        render={
          <Button
            kind="tertiary"
            className={tw(
              "hidden sm:flex px-2 text-sm h-[32px] text-light",
              theme.includes("light") && "text-black",
            )}
            style={
              theme.includes("light")
                ? { border: "1px solid black" }
                : undefined
            }
          />
        }
      >
        <DownloadIcon />
      </Menu.Trigger>
      <Menu.Popover>
        <Menu.Container>
          <Menu.Arrow />
          <Menu.Header className="text-xs py-1 px-1">CSV</Menu.Header>
          <Menu.Item
            className="flex items-center gap-2"
            onAction={async () => {
              if (!api) return;

              const rect = await api.exportData();
              const blob = getCsvFile(rect, false);

              downloadBlob(blob, "stock-screener.csv");
            }}
          >
            <CsvIcon />
            <span>Export CSV</span>
          </Menu.Item>
          <Menu.Item
            className="flex items-center gap-2"
            onAction={async () => {
              if (!api) return;

              const rect = await api.exportData();
              const blob = getCsvFile(rect, true);

              downloadBlob(blob, "stock-screener.csv");
            }}
          >
            <CsvIcon />
            <span>
              Export CSV{" "}
              <span className="text-xs text-ln-gray-70">(With Headers)</span>
            </span>
          </Menu.Item>
          <Menu.Header className="text-xs py-1 px-1">Excel</Menu.Header>
          <Menu.Item
            className="flex items-center gap-2"
            onAction={async () => {
              if (!api) return;

              const rect = await api.exportData();
              const blob = await getExcelFile(rect);

              downloadBlob(blob, "stock-screener.xlsx");
            }}
          >
            <ExcelIcon />
            <span>Export Excel</span>
          </Menu.Item>
        </Menu.Container>
      </Menu.Popover>
    </Menu>
  );
}
