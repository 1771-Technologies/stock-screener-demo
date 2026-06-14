"use client";

import { SearchIcon } from "../icons";
import { tw } from "../lib/tw";
import { Input } from "../ui/input";

export function QuickSearchInput({
  value,
  onChange,
  theme,
}: {
  value: string;
  onChange: (v: string) => void;
  theme: string;
}) {
  console.log(theme.includes("light"));
  return (
    <Input
      small
      placeholder="quick search..."
      startElement={<SearchIcon />}
      startElementClass={theme.includes("light") ? "text-black bg-white" : ""}
      className={tw(
        "placeholder:text-ultraLight px-2",
        theme.includes("light") ? "text-black bg-white" : "",
      )}
      containerClassName="hidden sm:flex"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
