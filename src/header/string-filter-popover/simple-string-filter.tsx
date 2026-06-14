import { SmartSelect } from "lytenyte-pro/components";
import { type Dispatch, useEffect, useMemo, useState } from "react";
import type {
  FilterString,
  FilterStringOperator,
} from "../../filters/string-operator-filter";
import type { SetStateAction } from "jotai";
import { tw } from "../../lib/tw";

const OPERATOR_OPTIONS = [
  { id: "contains", label: "Contains" },
  { id: "not_contains", label: "Does Not Contain" },
  { id: "equals", label: "Equals" },
  { id: "not_equals", label: "Not Equals" },
  { id: "begins_with", label: "Begins With" },
  { id: "not_begins_with", label: "Does Not Begin With" },
  { id: "ends_with", label: "Ends With" },
  { id: "not_ends_with", label: "Does Not End With" },
] as const;

export function SimpleStringFilter({
  tempLeft,
  tempRight,
  tempCombinator,
  setTempLeft,
  setTempRight,
  setTempCombinator,
}: {
  tempRight: Partial<FilterString>;
  tempLeft: Partial<FilterString>;
  tempCombinator: "AND" | "OR";
  setTempLeft: Dispatch<SetStateAction<Partial<FilterString>>>;
  setTempRight: Dispatch<SetStateAction<Partial<FilterString>>>;
  setTempCombinator: Dispatch<SetStateAction<"AND" | "OR">>;
}) {
  const selectedRightOption = useMemo(
    () => OPERATOR_OPTIONS.find((o) => o.id === tempRight.operator) ?? null,
    [tempRight.operator],
  );

  const selectedOperatorOption = useMemo(
    () => OPERATOR_OPTIONS.find((o) => o.id === tempLeft.operator) ?? null,
    [tempLeft.operator],
  );

  const firstIsValid = !!(tempLeft.operator && tempLeft.value?.trim());

  // Once the second row becomes visible it stays visible for the session,
  // even if the user clears the first condition.
  const [showSecond, setShowSecond] = useState(() => !!tempRight.operator);
  useEffect(() => {
    if (firstIsValid) setShowSecond(true);
  }, [firstIsValid]);

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="text-xs text-(--ln-gray-60)">Operator</div>
      <div className="text-xs text-(--ln-gray-60)">Values</div>

      <SmartSelect
        kind="basic"
        value={selectedOperatorOption}
        options={OPERATOR_OPTIONS as unknown as { id: string; label: string }[]}
        onOptionChange={(v) => {
          if (v)
            setTempLeft((prev) => ({
              ...prev,
              operator: v.id as FilterStringOperator,
            }));
        }}
        container={
          <SmartSelect.Container className="max-h-60 overflow-auto z-50 bg-(--ln-gray-05) border border-(--ln-gray-30) rounded-md shadow-md" />
        }
        trigger={
          <SmartSelect.BasicTrigger
            data-ln-input
            className="flex w-full items-center justify-between gap-1 text-xs truncate"
            style={{ height: 28 }}
          >
            <span className="truncate">
              {selectedOperatorOption?.label ?? "Select..."}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="shrink-0"
            >
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
            </svg>
          </SmartSelect.BasicTrigger>
        }
      >
        {(p) => (
          <SmartSelect.Option
            {...p}
            className={tw(
              "flex items-center px-2 py-1 text-xs cursor-pointer",
              "hover:bg-(--ln-primary-20) focus-visible:bg-(--ln-primary-20)",
              p.selected && "text-(--ln-primary-50)",
            )}
          >
            {p.option.label}
          </SmartSelect.Option>
        )}
      </SmartSelect>

      <input
        data-ln-input
        style={{ height: 28 }}
        className="text-xs w-full"
        placeholder="Filter value..."
        value={tempLeft.value ?? ""}
        onChange={(e) =>
          setTempLeft((prev) => ({ ...prev, value: e.target.value }))
        }
      />

      {/* Second condition — shown once first was valid; stays visible even if first is cleared */}
      {showSecond && (
        <>
          {/* AND / OR combinator */}
          <div className="col-span-2 flex items-center justify-center gap-2 py-1">
            <div className="flex gap-1 items-center justify-end text-sm text-ln-gray-80">
              <label className="flex gap-2 items-center cursor-pointer select-none">
                <input
                  type="radio"
                  checked={tempCombinator === "AND"}
                  onChange={() => setTempCombinator("AND")}
                  className={tw(
                    "appearance-none h-4 w-4 rounded-full border border-ln-gray-40",
                    "checked:border-ln-primary-50 checked:border-[5px] cursor-pointer select-none",
                    "focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-ln-primary-50",
                  )}
                />
                And
              </label>
            </div>
            <div className="px-2 text-sm text-ln-gray-80">
              <label className="flex gap-2 items-center cursor-pointer select-none">
                <input
                  type="radio"
                  checked={tempCombinator === "OR"}
                  onChange={() => setTempCombinator("OR")}
                  className={tw(
                    "appearance-none h-4 w-4 rounded-full border border-ln-gray-40",
                    "checked:border-ln-primary-50 checked:border-[5px] cursor-pointer select-none",
                    "focus-visible:outline focus-visible:outline-offset-1 focus-visible:outline-ln-primary-50",
                  )}
                />
                Or
              </label>
            </div>
          </div>

          {/* Right condition */}
          <SmartSelect
            kind="basic"
            value={selectedRightOption}
            options={
              OPERATOR_OPTIONS as unknown as { id: string; label: string }[]
            }
            onOptionChange={(v) => {
              if (v)
                setTempRight((prev) => ({
                  ...prev,
                  operator: v.id as FilterStringOperator,
                }));
            }}
            container={
              <SmartSelect.Container className="max-h-60 overflow-auto z-50 bg-(--ln-gray-05) border border-(--ln-gray-30) rounded-md shadow-md" />
            }
            trigger={
              <SmartSelect.BasicTrigger
                data-ln-input
                className="flex w-full items-center justify-between gap-1 text-xs truncate"
                style={{ height: 28 }}
              >
                <span className="truncate">
                  {selectedRightOption?.label ?? "Select..."}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="shrink-0"
                >
                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                </svg>
              </SmartSelect.BasicTrigger>
            }
          >
            {(p) => (
              <SmartSelect.Option
                {...p}
                className={tw(
                  "flex items-center px-2 py-1 text-xs cursor-pointer",
                  "hover:bg-(--ln-primary-20) focus-visible:bg-(--ln-primary-20)",
                  p.selected && "text-(--ln-primary-50)",
                )}
              >
                {p.option.label}
              </SmartSelect.Option>
            )}
          </SmartSelect>

          <input
            data-ln-input
            style={{ height: 28 }}
            className="text-xs w-full"
            placeholder="Filter value..."
            value={tempRight.value ?? ""}
            onChange={(e) =>
              setTempRight((prev) => ({ ...prev, value: e.target.value }))
            }
          />
        </>
      )}
    </div>
  );
}
