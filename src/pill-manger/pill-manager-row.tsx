import { GridBox } from "@1771technologies/lytenyte-pro";
import {
  CollapseGroupIcon,
  ExpandGroupIcon,
} from "@1771technologies/lytenyte-pro/icons";
import { type PropsWithChildren, type ReactNode, useState } from "react";
import { tw } from "../lib/tw";
import { GridIconButton } from "../ui/icon-button";

export interface PillManagerRowProps {
  readonly icon: ReactNode;
  readonly label: string;
  readonly menu: ReactNode;
  readonly className?: string;
}
export function PillManagerRow({
  icon,
  label,
  children,
  menu,
  className,
}: PropsWithChildren<PillManagerRowProps>) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={tw(
        "grid grid-cols-[42px_1fr_64px] md:grid-cols-[151px_1fr_118px] bg-ln-gray-05 border-t border-ln-gray-20"
      )}
    >
      <div className="flex justify-center md:justify-start md:pl-[30px] md:pr-3 items-center gap-2 text-sm text-ln-gray-80 min-h-[52px]">
        {icon}
        <div className="hidden md:block">{label}</div>
      </div>
      <GridBox.Panel
        className={tw(
          "flex items-center w-full no-scrollbar overflow-auto max-h-[200px] md:max-h-[unset] focus:outline-none",
          "focus-visible:outline focus-visible:outline-ln-primary-50 focus-visible:-outline-offset-1",
          expanded && "flex-wrap",
          className
        )}
      >
        {children}
      </GridBox.Panel>
      <div
        className={tw(
          "flex items-center  pl-1 gap-1 md:pl-3 pr-[30px] border-l border-ln-gray-30 relative md:gap-3",
          "before:absolute before:-left-1 before:bg-linear-to-tr before:from-transparent before:to-[rgba(0,0,0,0.075)] before:w-1 before:h-full"
        )}
      >
        {menu}
        <GridIconButton
          onClick={() => setExpanded((prev) => !prev)}
          className="min-w-7 h-7"
        >
          {expanded ? (
            <CollapseGroupIcon width={20} height={20} />
          ) : (
            <ExpandGroupIcon width={20} height={20} />
          )}
        </GridIconButton>
      </div>
    </div>
  );
}
