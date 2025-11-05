"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { useState } from "react";
import { Tooltip as T } from "radix-ui";
import clsx from "clsx";

export interface TooltipProps {
  content: ReactNode;
  className?: string;
  side?: "left" | "right" | "top" | "bottom";
  disabled?: boolean;
}
export function Tooltip({
  content,
  children,
  disabled,
  className,
  side,
}: PropsWithChildren<TooltipProps>) {
  const [open, setOpen] = useState(false);
  if (disabled) return <>{children}</>;
  return (
    <T.Provider delayDuration={200}>
      <T.Root open={open} onOpenChange={setOpen}>
        <T.Trigger asChild onClick={() => setOpen(true)}>
          {children}
        </T.Trigger>
        <T.Portal>
          <T.Content
            className={clsx(
              "p-2 bg-white text-black border-black rounded text-sm",
              className
            )}
            side={side}
          >
            {content}
            <T.Arrow className="fill-white stroke-black" />
          </T.Content>
        </T.Portal>
      </T.Root>
    </T.Provider>
  );
}
