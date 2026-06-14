import clsx from "clsx";
import { Grid } from "lytenyte-pro";
import { GridSpec } from "../../types";
import { SortEntry } from "../../sort-manager/sort-types";
import { GridIconButton } from "../../../components/icon-button";

const ArrowUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentcolor"
    viewBox="0 0 256 256"
  >
    <path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentcolor"
    viewBox="0 0 256 256"
  >
    <path d="M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z" />
  </svg>
);

export function SortButton({
  column,
  api,
  isNumber,
}: {
  column: Grid.Column<GridSpec>;
  api: Grid.T.HeaderParams<GridSpec>["api"];
  isNumber: boolean;
}) {
  const sortEntries = api.sortModel.useValue() ?? [];
  const sortIndex = sortEntries.findIndex((e) => e.columnId === column.id);
  const sortEntry = sortIndex !== -1 ? sortEntries[sortIndex] : null;
  const visibleIndex = sortEntries.length > 1 ? sortIndex + 1 : 0;

  const handleClick = (ev: React.MouseEvent) => {
    const multi = ev.ctrlKey || ev.metaKey;
    const newEntry: SortEntry = {
      id: column.id,
      columnId: column.id,
      descending: false,
      sortOnId: "values",
    };

    if (!sortEntry) {
      api.sortModel.set(multi ? [...sortEntries, newEntry] : [newEntry]);
    } else if (!sortEntry.descending) {
      const updated = sortEntries.map((e) =>
        e.id === sortEntry.id ? { ...e, descending: true } : e,
      );
      api.sortModel.set(multi ? updated : [{ ...sortEntry, descending: true }]);
    } else {
      const removed = sortEntries.filter((e) => e.id !== sortEntry.id);
      api.sortModel.set(multi ? removed : []);
    }
  };

  return (
    <GridIconButton
      onClick={handleClick}
      style={{ opacity: sortEntry ? "1" : undefined }}
      className={clsx(
        "bg-ln-gray-05 absolute transition-opacity",
        "opacity-0 group-hover:opacity-80 backdrop-blur-lg",
        "transition-opacity group-hover:focus:opacity-90 focus-visible:opacity-90",
        isNumber ? "left-1.5" : "right-1.5",
        sortEntry &&
          "group-hover:opacity-100 opacity-100 hover:opacity-100 text-ln-primary-50",
      )}
    >
      {sortEntry?.descending ? <ArrowDownIcon /> : <ArrowUpIcon />}
      {visibleIndex !== 0 && (
        <span className="absolute -top-1 -right-1 text-[9px] leading-none font-medium">
          {visibleIndex}
        </span>
      )}
    </GridIconButton>
  );
}
