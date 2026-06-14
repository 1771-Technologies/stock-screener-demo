"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { useState } from "react";
import { Tooltip as T } from "radix-ui";
import { tw } from "../lib/tw";

export interface TooltipProps {
  content: ReactNode;
  className?: string;
  side?: "left" | "right" | "top" | "bottom";
  disabled?: boolean;
  container?: HTMLElement | null;
}
export function Tooltip({
  content,
  children,
  disabled,
  className,
  container,
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
        <T.Portal container={container}>
          <T.Content
            className={tw(
              "p-2 bg-white text-black border-black rounded text-sm",
              className,
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
