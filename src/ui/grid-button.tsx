import { type HTMLProps } from "react";
import { tw } from "../lib/tw";

// box-shadow: 0 1.5px 2px 0 rgba(18, 46, 88, 0.08), 0 0 0 1px var(--UI-Colors-Borders-Button-Light-Border, #303A41);

// UI Colors/Backgrounds/Button Light

export function GridButton(props: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...(props as any)}
      className={tw(
        "bg-ln-gray-20 rounded-md flex items-center gap-0.5 px-2 h-7 text-xs text-ln-gray-80 font-medium",
        "shadow-[0_1.5px_2px_0_rgba(18,46,88,0.08),0_0_0_1px_var(--ln-gray-40)]",
        "focus-visible:ring-1 focus-visible:ring-ln-primary-50 focus:outline-none",
        props.className,
      )}
    ></button>
  );
}
