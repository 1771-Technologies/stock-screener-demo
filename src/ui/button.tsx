"use client";

import type { JSX } from "react";
import { tw } from "../lib/tw";

export interface ButtonProps {
  kind?: "primary" | "secondary" | "tertiary";
}

export function Button({
  kind = "primary",
  ...props
}: JSX.IntrinsicElements["button"] & ButtonProps) {
  return (
    <button
      {...props}
      style={{
        ...(kind === "tertiary"
          ? {
              borderRadius: "10px",
              border: "1px solid rgba(159, 224, 218, 0.16)",
              background: "rgba(135, 227, 224, 0.05)",
              boxShadow:
                "0px 2px 2px 0px rgba(4, 19, 18, 0.22), 0px 0px 11px 0px rgba(212, 242, 240, 0.12) inset",
              backdropFilter: "blur(5px)",
            }
          : {}),
        ...props.style,
      }}
      className={tw(
        "h-9 text-nowrap rounded-[10px] font-semibold flex items-center justify-center gap-2 focus:outline-none focus-visible:outline focus-visible:outline-brand focus-visible:outline-offset-2",
        "disabled:bg-brand/90 text-black",
        kind === "primary" &&
          "bg-brandButton hover:bg-brand/85 transition-colors",
        kind === "secondary" &&
          "link-button-primary flex items-center justify-center gap-1 text-page h-10 px-3 font-semibold hover:opacity-80 transition-all",
        kind === "tertiary" &&
          "button-tertiary text-white hover:text-brand hover:border-brand transition-colors",
        props.className,
      )}
    />
  );
}
