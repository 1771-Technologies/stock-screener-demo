import { ContextMenu as CM } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { ChevronRightIcon } from "@1771technologies/lytenyte-pro/icons";
import { Tooltip } from "../ui/tooltip";
import { MenuIcon } from "../ui/menu/menu-item";
import { tw } from "../lib/tw";

const itemCls =
  "flex items-center text-sm text-ln-gray-80 cursor-pointer  data-[highlighted]:bg-ln-gray-30 py-1 pr-3 px-2 focus-visible:outline-none";

export const Item = ({
  icon,
  label,
  disableReason,
  ...props
}: Omit<ComponentProps<typeof CM.Item>, "children"> & {
  icon?: ReactNode;
  label: ReactNode;
  disableReason?: ReactNode;
}) => {
  return (
    <Tooltip
      content={disableReason}
      className="z-100"
      disabled={!props.disabled}
    >
      <CM.Item
        {...props}
        className={tw(props.className, itemCls)}
        style={{ color: props.disabled ? "var(--lng1771-gray-60)" : undefined }}
      >
        {icon && <MenuIcon>{icon}</MenuIcon>}
        {label}
      </CM.Item>
    </Tooltip>
  );
};

export const SubTrigger = ({
  icon,
  label,
  disableReason,
  ...props
}: Omit<ComponentProps<typeof CM.SubTrigger>, "children"> & {
  icon?: ReactNode;
  label: ReactNode;
  disableReason?: ReactNode;
}) => {
  return (
    <Tooltip
      content={disableReason}
      className="z-100"
      disabled={!props.disabled}
    >
      <CM.SubTrigger
        {...props}
        className={tw(
          props.className,
          "flex text-sm align-center text-ln-gray-80 cursor-pointer py-1 data-highlighted:bg-ln-gray-30 pl-2 focus-visible:outline-none"
        )}
        style={{ color: props.disabled ? "var(--lng1771-gray-60)" : undefined }}
      >
        {icon && <MenuIcon>{icon}</MenuIcon>}

        <div className="flex-1">{label}</div>

        <MenuIcon>
          <ChevronRightIcon className="ml-2" />
        </MenuIcon>
      </CM.SubTrigger>
    </Tooltip>
  );
};

export const Separator = () => {
  return <CM.Separator className="bg-ln-gray-30 h-px w-full my-px" />;
};
