import { SetStateAction } from "jotai";
import { Checkbox } from "lytenyte-pro/components";
import { Dispatch, useMemo, useState } from "react";

export function SetFilter({
  allValues,
  tempSelected,
  setTempSelected,
}: {
  allValues: string[];
  tempSelected: Set<string>;
  setTempSelected: Dispatch<SetStateAction<Set<string>>>;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredValues = useMemo(() => {
    if (!searchQuery.trim()) return allValues;
    const q = searchQuery.toLowerCase();
    return allValues.filter((v) => v.toLowerCase().includes(q));
  }, [allValues, searchQuery]);

  const allSelected = tempSelected.size === allValues.length;
  const someSelected = tempSelected.size > 0 && !allSelected;

  return (
    <div className="flex flex-col gap-1 min-h-[200px] bg-ln-gray-02 border-ln-gray-30 rounded-lg overflow-hidden">
      <div className="relative mb-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-ln-gray-60 pointer-events-none"
        >
          <path d="M229.66,218.34l-50.07-50.07a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.31ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
        </svg>
        <input
          style={{ height: 28 }}
          className="text-xs w-full border-0 border-b border-ln-gray-20 rounded-none shadow-none bg-ln-gray-02 pl-7 pr-2"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Select All row */}
      <label className="flex items-center gap-2 px-1 py-0.5 cursor-pointer hover:bg-[var(--ln-gray-10)] rounded text-xs">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onClick={(e) => {
            e.stopPropagation();
            setTempSelected(allSelected ? new Set() : new Set(allValues));
          }}
        />
        <span className="text-[var(--ln-gray-80)]">(Select All)</span>
      </label>

      {/* Value list */}
      <div
        className="overflow-y-auto max-h-[200px] flex flex-col gap-0.5"
        style={{ scrollbarWidth: "thin" }}
      >
        {filteredValues.map((v: string) => {
          const checked = tempSelected.has(v);
          return (
            <label
              key={v}
              className="flex items-center gap-2 px-1 py-0.5 cursor-pointer hover:bg-[var(--ln-gray-10)] rounded text-xs"
            >
              <Checkbox
                checked={checked}
                onClick={(e) => {
                  e.stopPropagation();
                  setTempSelected((prev) => {
                    const next = new Set(prev);
                    if (checked) next.delete(v);
                    else next.add(v);
                    return next;
                  });
                }}
              />
              <span className="text-[var(--ln-gray-80)] truncate">
                {v}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
