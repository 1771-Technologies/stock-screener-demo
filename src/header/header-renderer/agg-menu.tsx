import { Grid } from "lytenyte-pro";
import { Menu } from "lytenyte-pro/components";
import { CheckIcon } from "@radix-ui/react-icons";
import type { GridSpec } from "../../types";
import { tw } from "../../lib/tw";

interface Props {
  column: Grid.Column<GridSpec>;
  api: Grid.T.HeaderParams<GridSpec>["api"];
  isNumber: boolean;
}

export function AggMenu({ column, api, isNumber }: Props) {
  const aggsAllowed: string[] = (column as any).aggsAllowed ?? [];

  return (
    <Menu placement="bottom-start">
      <Menu.Trigger
        render={
          <button
            className={tw(
              "text-xs text-ln-primary-50 focus:outline-none focus-visible:underline hover:bg-ln-primary-30 px-1 py-0.5 rounded",
              isNumber && "order-1",
            )}
          />
        }
      >
        ({column.agg})
      </Menu.Trigger>
      <Menu.Popover>
        <Menu.Container>
          <Menu.RadioGroup
            value={column.agg ?? ""}
            onChange={(fn) => api.columnUpdate({ [column.id]: { agg: fn } })}
          >
            {aggsAllowed.map((fn) => (
              <Menu.RadioItem
                key={fn}
                value={fn}
                className="flex gap-2 min-w-[100px]"
              >
                {(checked) => (
                  <>
                    <span className="flex-1 capitalize text-ln-primary-50">
                      {fn}
                    </span>
                    {checked && <CheckIcon />}
                  </>
                )}
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>
        </Menu.Container>
      </Menu.Popover>
    </Menu>
  );
}
