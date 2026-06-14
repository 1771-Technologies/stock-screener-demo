import { Grid } from "lytenyte-pro";
import { Checkbox, Menu, PillManager } from "lytenyte-pro/components";
import { Dispatch, SetStateAction, useState } from "react";
import { GridSpec } from "../types";
import { GridButton } from "../../components/grid-button";
import { AddSmallIcon } from "@1771technologies/lytenyte-core/icons";

interface AddMenuProps {
  row: PillManager.T.PillRow;
  grouped: string[];
  setColumns: Dispatch<SetStateAction<Grid.Column<GridSpec>[]>>;
  setGrouped: Dispatch<SetStateAction<string[]>>;
}

export function AddMenu({
  row,
  grouped,
  setColumns,
  setGrouped,
}: AddMenuProps) {
  const [open, setOpen] = useState(false);

  function toggle(pill: PillManager.T.PillItem) {
    if (row.id === "columns") {
      setColumns((prev) =>
        prev.map((c) => (c.id === pill.id ? { ...c, hide: pill.active } : c)),
      );
    }
    if (row.id === "groups") {
      if (grouped.includes(pill.id)) {
        setGrouped((prev) => prev.filter((id) => id !== pill.id));
      } else {
        setGrouped((prev) => [...prev, pill.id]);
        setColumns((prev) =>
          prev.map((c) => (c.id === pill.id ? { ...c, hide: true } : c)),
        );
      }
    }
  }

  return (
    <Menu open={open} onOpenChange={setOpen} placement="bottom-end">
      <Menu.Trigger render={<GridButton className="px-1 md:px-2"></GridButton>}>
        <AddSmallIcon width={20} height={20} />
        <span className="hidden md:inline-block">Add</span>
      </Menu.Trigger>
      <Menu.Popover className="">
        <Menu.Arrow />
        <Menu.Container
          className="max-h-[300px] min-w-[200px] overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--ln-gray-50) transparent",
          }}
        >
          {row.pills.map((pill) => (
            <Menu.CheckboxItem
              key={pill.id}
              checked={pill.active}
              onCheckChange={() => toggle(pill)}
              closeOnAction={false}
              className="data-[ln-checked]:bg-transparent data-[ln-checked]:hover:bg-ln-gray-05 flex gap-2 items-center"
            >
              {(checked) => (
                <>
                  <Checkbox checked={checked} />
                  <span>{pill.name ?? pill.id}</span>
                </>
              )}
            </Menu.CheckboxItem>
          ))}
        </Menu.Container>
      </Menu.Popover>
    </Menu>
  );
}
