import type { PropsWithChildren } from "react";
import { ThemePicker } from "./theme-picker";

export function GridFrame(props: PropsWithChildren) {
  return (
    <div className="w-[80%] max-w-7xl h-[80%] max-h-[1200px] border border-ln-gray-30 rounded-lg lng-grid">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 py-4 px-4">
          <h2 className="flex-1 text-ln-gray-80 font-medium">Stock Screener</h2>
          <div className="flex-1" />
        </div>
        <div className="flex-1">{props.children}</div>
        <div className="border-t border-ln-gray-30">
          <ThemePicker />
        </div>
      </div>
    </div>
  );
}
