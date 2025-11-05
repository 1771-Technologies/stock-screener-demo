import {
  CsvIcon,
  DownloadIcon,
  ExcelIcon,
} from "@1771technologies/lytenyte-pro/icons";
import type { Grid } from "@1771technologies/lytenyte-pro/types";
import { DropdownMenu as D } from "radix-ui";
import { GridDropMenuContent } from "./ui/dialog";
import { Item } from "./ui/menu/menu-item";
import { downloadBlob } from "./download-file";
import { getExcelFile } from "./excel-export";
import { GridIconButton } from "./ui/icon-button";

export function ExportMenu({
  grid,
}: {
  grid: Grid<(string | number | null)[]>;
}) {
  return (
    <D.Root>
      <D.Trigger asChild>
        <GridIconButton className="sm:flex text-sm h-8 text-light w-8 border border-ln-gray-30 rounded-lg cursor-pointer">
          <DownloadIcon />
        </GridIconButton>
      </D.Trigger>
      <D.Portal>
        <GridDropMenuContent>
          <div className="text-ln-gray-60 py-1 text-xs">CSV</div>
          <Item
            icon={<CsvIcon />}
            label="Export CSV"
            onClick={() => {
              grid.api
                .exportCsvFile({
                  includeHeader: false,
                })
                .then((file) => {
                  downloadBlob(file, "stock-screener-data.csv");
                });
            }}
          />
          <Item
            icon={<CsvIcon />}
            label={
              <div className="flex items-center gap-1">
                Export CSV{" "}
                <span className="text-xs text-lng-gray-60">(With Headers)</span>
              </div>
            }
            onClick={() => {
              grid.api
                .exportCsvFile({
                  includeHeader: true,
                })
                .then((file) => {
                  downloadBlob(file, "stock-screener-data-with-headers.csv");
                });
            }}
          />
          <div className="text-ln-gray-60 py-1 text-xs">Excel</div>
          <Item
            icon={<ExcelIcon />}
            label="Excel Export"
            onClick={async () => {
              const data = await grid.api.exportDataRect({});

              const file = await getExcelFile(data);

              downloadBlob(file, "stock-screen-excel.xlsx");
            }}
          />

          <D.Arrow fill="var(--lng1771-gray-30)" />
        </GridDropMenuContent>
      </D.Portal>
    </D.Root>
  );
}
