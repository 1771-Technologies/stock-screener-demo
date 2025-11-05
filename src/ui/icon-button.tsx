import { type JSX } from "react";
import { tw } from "../lib/tw";

export function GridIconButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      className={tw(
        "hover:bg-ln-gray-20 cursor-pointer size-7 text-ln-gray-70 rounded flex items-center justify-center focus:outline-none focus-visible:outline-1 focus-visible:outline-ln-primary-50 focus-visible:outline-offset-[-3px] transition-colors min-w-6 min-h-6",
        props.className
      )}
    ></button>
  );
}
