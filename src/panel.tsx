import { useState } from "react";
import { Resizable } from "re-resizable";
import { type Grid } from "@1771technologies/lytenyte-pro/types";
import { ColumnManagerContent } from "./column-manager/column-manager-content";

export function Panel({ grid }: { grid: Grid<(string | number | null)[]> }) {
  const [expanded, setExpanded] = useState(false);
  const viewportHeight = grid.state.viewportHeightInner.useValue();
  return (
    <div className="hidden md:flex border-t border-ln-gray-30">
      {expanded && (
        <Resizable
          className="bg-ln-gray-05 h-full"
          maxHeight={viewportHeight}
          minHeight={viewportHeight}
          minWidth={300}
          maxWidth={500}
          handleStyles={{
            left: {
              left: 0,
            },
          }}
          enable={{
            bottom: false,
            bottomLeft: false,
            bottomRight: false,
            right: false,
            top: false,
            topLeft: false,
            topRight: false,
            left: true,
          }}
        >
          <ColumnManagerContent grid={grid} panel />
        </Resizable>
      )}

      <div className="border-l border-ln-gray-30">
        <button
          className="py-2 text-ln-gray-80 border-b border-b-ln-gray-30 bg-ln-gray-10 text-sm px-1 hover:bg-ln-gray-30 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ln-primary-50 min-w-7"
          style={{
            textOrientation: "sideways",
            writingMode: "vertical-lr",
          }}
          onClick={() => setExpanded((prev) => !prev)}
        >
          Columns
        </button>
      </div>
    </div>
  );
}
