import { Grid, computeField } from "lytenyte-pro";
import type { GridSpec } from "../types";
import { getSortOnOptions } from "./sort-on-options";

function resolveValue(
  col: Grid.Column<GridSpec>,
  node: Grid.T.RowNode<GridSpec["data"]>,
): unknown {
  return computeField(
    node.kind === "branch" ? col.id : (col.field ?? col.id),
    node,
  );
}

const PUNCT = /[^\w\s]/g;

export function buildSortFn(
  col: Grid.Column<GridSpec>,
  sortOnId: string,
): Grid.T.SortFn<GridSpec["data"]> | null {
  if (sortOnId === "values") return null;

  const { nullsFirst, caseInsensitive, ignorePunctuation, absolute } =
    getSortOnOptions(sortOnId);

  return (leftNode, rightNode) => {
    const lRaw = resolveValue(col, leftNode);
    const rRaw = resolveValue(col, rightNode);

    if (lRaw == null && rRaw == null) return 0;
    if (lRaw == null) return nullsFirst ? -1 : 1;
    if (rRaw == null) return nullsFirst ? 1 : -1;

    if (col.type === "number" || absolute) {
      const lNum = Number(lRaw);
      const rNum = Number(rRaw);
      const l = absolute ? Math.abs(lNum) : lNum;
      const r = absolute ? Math.abs(rNum) : rNum;
      return l - r;
    }

    let l = String(lRaw);
    let r = String(rRaw);

    if (ignorePunctuation) {
      l = l.replace(PUNCT, "");
      r = r.replace(PUNCT, "");
    }
    if (caseInsensitive) {
      l = l.toLowerCase();
      r = r.toLowerCase();
    }

    return l < r ? -1 : l > r ? 1 : 0;
  };
}
