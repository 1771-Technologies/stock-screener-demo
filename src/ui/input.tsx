"use client";

import type { JSX, ReactNode } from "react";
import { tw } from "../lib/tw";

export interface InputProps {
  readonly label?: string;
  readonly labelFor?: string;
  readonly startElement?: ReactNode;
  readonly startElementClass?: string;
  readonly endElement?: ReactNode;
  readonly small?: boolean;
  readonly containerClassName?: string;
}

export function Input({
  label,
  labelFor,
  startElement,
  startElementClass,
  endElement,
  small,
  containerClassName,
  ...props
}: JSX.IntrinsicElements["input"] & InputProps) {
  return (
    <div className={tw("flex flex-col", containerClassName)}>
      <div
        className={tw(
          "transition-all border border-ln-gray-30 bg-ln-gray-02 flex items-center rounded-[10px] overflow-hidden h-9 focus-within:outline-brand focus-within:outline-1",
          small && "h-8",
        )}
      >
        {label && (
          <label htmlFor={labelFor} className="sr-only">
            {label}
          </label>
        )}
        {startElement && (
          <div
            className={tw(
              "w-8 flex items-center justify-center text-gray-700 h-full",
              startElementClass,
            )}
          >
            {startElement}
          </div>
        )}
        <input
          {...props}
          placeholder={props.placeholder ?? props.name}
          className={tw(
            "placeholder:capitalize flex-1 focus:outline-none text-sm h-full",
            props.className,
          )}
        />
        {endElement && (
          <div className="w-8 flex items-center justify-center text-gray-700">
            {endElement}
          </div>
        )}
      </div>
    </div>
  );
}
