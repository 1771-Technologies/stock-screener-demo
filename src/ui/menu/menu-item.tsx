import clsx from "clsx";
import { DropdownMenu as D } from "radix-ui";
import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import {
  ChevronRightIcon,
  TickmarkIcon,
} from "@1771technologies/lytenyte-pro/icons";
import { Tooltip } from "../tooltip";

export const MenuIcon = (props: PropsWithChildren) => {
  return (
    <span className="flex items-center justify-center text-ln-gray-70 w-5 h-6 mr-2">
      {props.children}
    </span>
  );
};

const itemCls =
  "flex items-center text-sm text-ln-gray-80 cursor-pointer  data-[highlighted]:bg-ln-gray-30 py-1 pr-2 px-0.5 rounded-lg focus-visible:outline-none";

export const Item = ({
  icon,
  label,
  disableReason,
  ...props
}: Omit<ComponentProps<typeof D.Item>, "children"> & {
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
      <D.Item
        {...props}
        className={clsx(props.className, itemCls)}
        style={{ color: props.disabled ? "var(--lng1771-gray-60)" : undefined }}
      >
        {icon && <MenuIcon>{icon}</MenuIcon>}
        {label}
      </D.Item>
    </Tooltip>
  );
};

export const RadioItem = ({
  icon,
  ...props
}: Omit<ComponentProps<typeof D.DropdownMenuRadioItem>, "children"> & {
  icon?: ReactNode;
  label: ReactNode;
}) => {
  return (
    <D.DropdownMenuRadioItem
      {...props}
      className={clsx(
        props.className,
        itemCls,
        "group",
        "data-disabled:text-ln-gray-30"
      )}
    >
      {icon && <MenuIcon>{icon}</MenuIcon>}
      {props.label}
      <MenuIcon>
        <TickmarkIcon
          className="stroke-ln-primary-50 group-data-[state='checked']:block hidden relative"
          style={{ right: -16 }}
        />
      </MenuIcon>
    </D.DropdownMenuRadioItem>
  );
};

export const SubTrigger = ({
  icon,
  label,
  disableReason,
  ...props
}: Omit<ComponentProps<typeof D.SubTrigger>, "children"> & {
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
      <D.SubTrigger
        {...props}
        className={clsx(
          props.className,
          "flex text-sm align-center text-ln-gray-80 cursor-pointer py-1 data-highlighted:bg-ln-gray-30 transition-colors pl-0.5 focus-visible:outline-none rounded-lg"
        )}
        style={{ color: props.disabled ? "var(--lng1771-gray-60)" : undefined }}
      >
        {icon && <MenuIcon>{icon}</MenuIcon>}

        <div className="flex-1 flex items-center">{label}</div>

        <MenuIcon>
          <ChevronRightIcon className="ml-2" />
        </MenuIcon>
      </D.SubTrigger>
    </Tooltip>
  );
};

export const Separator = () => {
  return <D.Separator className="bg-ln-gray-30 h-px w-full my-px" />;
};
