import type { JSX } from "react";
import { type HTMLProps } from "react";
import { tw } from "../lib/tw";

export function GridIconButton(props: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...(props as any)}
      className={tw(
        "hover:bg-ln-gray-20 size-7 text-ln-gray-70 rounded flex items-center justify-center focus:outline-none focus-visible:outline-1 focus-visible:outline-ln-primary-50 focus-visible:outline-offset-[-3px] transition-colors min-w-6 min-h-6",
        props.className,
      )}
    ></button>
  );
}

export function IconButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      type="button"
      className={tw(
        "h-7 w-7 flex items-center justify-center p-0 focus-visible:outline focus-visible:outline-brand rounded",
        props.className,
      )}
    />
  );
}
