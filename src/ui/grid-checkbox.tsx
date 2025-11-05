import { CheckIcon } from "@radix-ui/react-icons";
import { Checkbox as C } from "radix-ui";
import { tw } from "../lib/tw";

export function GridCheckbox({ children, ...props }: C.CheckboxProps) {
  return (
    <label className="text-md text-light flex items-center gap-2">
      <C.Root
        {...props}
        type="button"
        className={tw(
          "rounded border-transparent bg-ln-gray-02",
          "shadow-[0_1.5px_2px_0_rgba(18,46,88,0.08),0_0_0_1px_var(--lng1771-gray-40)]",
          "data-[state=checked]:bg-ln-primary-50 data-[state=checked]:shadow-[0_1.5px_2px_0_rgba(18,46,88,0.08),0_0_0_1px_var(--lng1771-primary-50)]",
          "h-4 w-4",
          props.className
        )}
      >
        <C.CheckboxIndicator className={tw("flex items-center justify-center")}>
          <CheckIcon className="text-(--checkmark)" />
        </C.CheckboxIndicator>
      </C.Root>
      {children}
    </label>
  );
}
