import { ChevronDownIcon } from "@1771technologies/lytenyte-pro/icons";
import { CheckIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { atom, useAtom } from "jotai";
import { Select } from "radix-ui";
import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { tw } from "../lib/tw";

export interface SelectOption {
  value: string;
  label: string;
}

export interface GridSelectProps {
  readonly placeholder?: string;
  readonly value?: SelectOption | null;
  readonly onChange?: (v: SelectOption) => void;
  readonly options: SelectOption[];
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly disabled?: boolean;
  readonly skipInert?: boolean;
}

const openId = atom<string | null>(null);
export function GridSelect(p: GridSelectProps) {
  const value = useMemo(() => p.value?.value ?? "", [p.value]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (p.skipInert) return;
    const grid = document.getElementById("stocks-grid")!;
    if (open) grid.inert = true;
    else grid.inert = false;
  }, [open, p.skipInert]);

  const id = useId();
  const [oid, setOid] = useAtom(openId);
  useEffect(() => {
    if (open && oid !== id) setOpen(false);
  }, [open, oid, id]);

  return (
    <Select.Root
      value={value}
      open={open}
      onOpenChange={(v) => {
        if (v) {
          setOpen(v);
          setOid(id);
        } else {
          setOpen(v);
        }
      }}
      onValueChange={(v) => {
        const value = p.options.find((c) => c.value === v)!;

        p.onChange?.(value);
      }}
    >
      <Select.Trigger
        disabled={p.disabled}
        className={tw(
          "min-w-full md:min-w-40 flex items-center justify-between shadow-[0_1.5px_2px_0px_var(--lng1771-gray-30),0_0_0_1px_var(--lng1771-gray-30)] rounded-lg px-2 h-7 text-sm data-placeholder:text-ln-gray-70",
          "bg-ln-gray-00 gap-2 text-ln-gray-90",
          "data-disabled:shadow-[0_1.5px_2px_0px_var(--lng1771-gray-20),0_0_0_1px_var(--lng1771-gray-20)] data-placeholder:data-disabled:text-ln-gray-50",
          "focus-visible:shadow-[0_1.5px_2px_0px_var(--lng1771-primary-50),0_0_0_1px_var(--lng1771-primary-50)]",
          "text-nowrap whitespace-nowrap text-ellipsis overflow-hidden",
          p.className
        )}
        style={p.style}
      >
        <Select.Value placeholder={p.placeholder ?? "Select..."} />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={5}
          className="overflow-x-hidden overflow-y-auto max-h-[300px] md:max-h-[unset] border border-ln-gray-30 bg-ln-gray-02 rounded-lg shadow-[0_14px_18px_-6px_rgba(30,30,41,0.07),0_3px_13px_0_rgba(30,30,41,0.10)] z-100 min-w-(--radix-select-trigger-width)"
          inert={false}
        >
          <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-1">
            {p.options.map((c) => {
              return (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              );
            })}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

const SelectItem = forwardRef(
  (
    { children, className, ...props }: Select.SelectItemProps,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <Select.Item
        className={tw(
          "h-8 py-1 px-2 text-sm text-ln-gray-80",
          "data-disabled:pointer-events-none data-disabled:text-ln-gray-60",
          "data-highlighted:text-lng-gray-90 data-highlighted:outline-none data-highlighted:bg-ln-gray-20 rounded-lg",
          "relative flex select-none items-center leading-none cursor-pointer",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute right-0 inline-flex w-[25px] items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

SelectItem.displayName = "SelectITem";
