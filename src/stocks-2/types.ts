import type { Grid, PieceWritable } from "lytenyte-pro";
import type { StringColumnFilter } from "./filters/string-operator-filter";
import type { NumberColumnFilter } from "./filters/number-operator-filter";

export interface GridSpec {
  readonly data: (string | number | null)[];
  readonly column: {
    readonly groupable?: boolean;
    readonly agg?: string | null | undefined;
    readonly aggsAllowed: string[];
  };
  readonly api: {
    readonly stringFilterModel: PieceWritable<Record<string, string>>;
    readonly numberFilterModel: PieceWritable<Record<string, string>>;
    readonly stringOperatorModel: PieceWritable<
      Record<string, StringColumnFilter>
    >;
    readonly stringSetModel: PieceWritable<
      Record<string, Grid.T.RowSelectionLinked>
    >;
    readonly numberOperatorModel: PieceWritable<
      Record<string, NumberColumnFilter>
    >;
    readonly numberSetModel: PieceWritable<
      Record<string, Grid.T.RowSelectionLinked>
    >;
    readonly getColumnValues: (colId: string) => string[];
    readonly grouped: PieceWritable<string[]>;
    readonly sortModel: PieceWritable<
      import("./sort-manager/sort-types").SortEntry[]
    >;
    readonly columns: PieceWritable<Grid.Column<GridSpec>[]>;
    readonly sortManagerOpen: PieceWritable<boolean>;
    readonly columnManagerOpen: PieceWritable<boolean>;
  };
}
