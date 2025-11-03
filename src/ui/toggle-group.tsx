import { ToggleGroup as TG } from "radix-ui";
import { tw } from "../lib/tw";

export function ToggleGroup(props: Parameters<typeof TG.Root>[0]) {
  return (
    <TG.Root
      {...props}
      className={tw(
        "flex items-center gap-2 bg-ln-gray-20 py-1 px-2 rounded-xl",
        props.className
      )}
    ></TG.Root>
  );
}

export function ToggleItem(props: Parameters<typeof TG.Item>[0]) {
  return (
    <TG.Item
      {...props}
      className={tw(
        "text-xs font-bold flex items-center justify-center px-2 py-1 text-ln-gray-70 outline-none focus:outline-none",
        "data-[state=on]:text-ln-gray-90 data-[state=on]:rounded-md data-[state=on]:bg-linear-to-b from-ln-gray-02 to-ln-gray-05",
        props.className
      )}
    ></TG.Item>
  );
}
