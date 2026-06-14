import { useState } from "react";
import { Menu } from "lytenyte-pro/components";
import { Grid } from "lytenyte-pro";
import type { GridSpec } from "../types";
import { ColumnMenuPopover } from "./column-menu-popover";
import { GridIconButton } from "../ui/icon-button";
import { MoreVerticalIcon } from "../icons";
import { tw } from "../lib/tw";

interface Props {
  column: Grid.Column<GridSpec>;
  api: Grid.T.HeaderParams<GridSpec>["api"];
  isNumber: boolean;
  className?: string;
  inDialog?: boolean;
}

export function ColumnMenu({
  column,
  api,
  isNumber,
  className,
  inDialog,
}: Props) {
  const [open, setOpen] = useState(false);

  const [menuContainer, setMenuContainer] = useState<HTMLElement | null>(null);

  return (
    <Menu
      open={open}
      onOpenChange={setOpen}
      placement="bottom-end"
      lightDismiss
      modal={false}
    >
      <Menu.Trigger
        render={({ open: isOpen, openChange }) => (
          <GridIconButton
            onClickCapture={(ev) => {
              ev.stopPropagation();
              openChange(!isOpen);
            }}
            className={tw(
              "bg-ln-gray-05 absolute transition-opacity",
              "opacity-0 group-hover:opacity-80 backdrop-blur-lg",
              "transition-opacity group-hover:focus:opacity-90 focus-visible:opacity-90",
              isNumber ? "left-9" : "right-9",
              isOpen && "opacity-100",
              className,
            )}
          >
            <MoreVerticalIcon />
          </GridIconButton>
        )}
      />

      <Menu.Popover
        ref={setMenuContainer}
        onClick={(ev) => {
          ev.stopPropagation();
        }}
      >
        <ColumnMenuPopover
          api={api}
          column={column}
          menuContainer={menuContainer}
          inDialog={inDialog}
        />
      </Menu.Popover>
    </Menu>
  );
}
