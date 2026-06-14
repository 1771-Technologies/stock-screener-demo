import type { PropsWithChildren, ReactNode } from "react";
import { tw } from "../lib/tw";
import { ThemePicker } from "../theme-picker";

interface FrameProps {
  readonly id: string;
  readonly title: ReactNode;
  readonly frameControls: ReactNode;
  readonly isLight: boolean;
  readonly frameHeader?: ReactNode;
  readonly className?: string;
}

export function Frame({
  title,
  frameControls,
  isLight,
  frameHeader,
  className,
  id,
  children,
}: PropsWithChildren<FrameProps>) {
  return (
    <div className="w-[95%] max-w-8xl h-[80%] max-h-[1200px] overflow-hidden border border-ln-gray-30 rounded-lg ln-grid">
      <div className="flex flex-col h-full">
        <div
          className={tw(
            "flex flex-col ln-grid h-full w-full bg-ln-gray-00",
            className,
          )}
          style={{ colorScheme: isLight ? "light" : undefined }}
        >
          <div>
            <div className="flex items-center gap-2 py-4 px-4">
              <h2 className="flex-1 text-ln-gray-90 font-medium">{title}</h2>
              <div className="flex-1" />
              {frameControls}
            </div>
            {frameHeader && (
              <>
                <div className="relative h-px bg-ln-gray-10 flex items-center justify-center"></div>
                {frameHeader}
              </>
            )}
          </div>

          <div id={id} className="flex flex-1 border-t border-ln-gray-20">
            {children}
          </div>
        </div>
        <div className="border-t border-ln-gray-30">
          <ThemePicker />
        </div>
      </div>
    </div>
  );
}
