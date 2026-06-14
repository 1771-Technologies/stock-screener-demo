import { tw } from "@/utils/tw";
import { SmartSelect } from "lytenyte-pro/components";
import { Dispatch, useEffect, useMemo, useState } from "react";
import {
  FilterNumber,
  FilterNumberOperator,
} from "../../filters/number-operator-filter";
import { SetStateAction } from "jotai";

const OPERATOR_OPTIONS = [
  { id: "equals", label: "Equals" },
  { id: "not_equals", label: "Not Equals" },
  { id: "greater_than", label: "Greater Than" },
  { id: "greater_than_or_equals", label: "Greater Than Or Equal To" },
  { id: "less_than", label: "Less Than" },
  { id: "less_than_or_equals", label: "Less Than Or Equal To" },
] as const;

const ChevronIcon = () => (
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
);

function OperatorSelect({
  value,
  onChange,
}: {
  value: { id: string; label: string } | null;
  onChange: (id: string) => void;
}) {
  return (
    <SmartSelect
      kind="basic"
      value={value}
      options={OPERATOR_OPTIONS as unknown as { id: string; label: string }[]}
      onOptionChange={(v) => v && onChange(v.id)}
      container={
        <SmartSelect.Container className="max-h-60 overflow-auto z-50 bg-[var(--ln-gray-05)] border border-[var(--ln-gray-30)] rounded-md shadow-md" />
      }
      trigger={
        <SmartSelect.BasicTrigger
          data-ln-input
          className="flex w-full items-center justify-between gap-1 text-xs truncate"
          style={{ height: 28 }}
        >
          <span className="truncate">{value?.label ?? "Select..."}</span>
          <ChevronIcon />
        </SmartSelect.BasicTrigger>
      }
    >
      {(p) => (
        <SmartSelect.Option
          {...p}
          className={tw(
            "flex items-center px-2 py-1 text-xs cursor-pointer",
            "hover:bg-[var(--ln-primary-20)] focus-visible:bg-[var(--ln-primary-20)]",
            p.selected && "text-[var(--ln-primary-50)]",
          )}
        >
          {p.option.label}
        </SmartSelect.Option>
      )}
    </SmartSelect>
  );
}

export function SimpleNumberFilter({
  tempLeft,
  tempRight,
  tempCombinator,
  setTempLeft,
  setTempRight,
  setTempCombinator,
}: {
  tempLeft: Partial<FilterNumber>;
  tempRight: Partial<FilterNumber>;
  tempCombinator: "AND" | "OR";
  setTempLeft: Dispatch<SetStateAction<Partial<FilterNumber>>>;
  setTempRight: Dispatch<SetStateAction<Partial<FilterNumber>>>;
  setTempCombinator: Dispatch<SetStateAction<"AND" | "OR">>;
}) {
  const selectedLeftOption = useMemo(
    () => OPERATOR_OPTIONS.find((o) => o.id === tempLeft.operator) ?? null,
    [tempLeft.operator],
  );

  const selectedRightOption = useMemo(
    () => OPERATOR_OPTIONS.find((o) => o.id === tempRight.operator) ?? null,
    [tempRight.operator],
  );

  const firstIsValid = !!(
    tempLeft.operator &&
    tempLeft.value != null &&
    !Number.isNaN(tempLeft.value)
  );

  const [showSecond, setShowSecond] = useState(() => !!tempRight.operator);
  useEffect(() => {
    if (firstIsValid) setShowSecond(true);
  }, [firstIsValid]);

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="text-xs text-[var(--ln-gray-60)]">Operator</div>
      <div className="text-xs text-[var(--ln-gray-60)]">Values</div>

      <OperatorSelect
        value={selectedLeftOption}
        onChange={(v) =>
          setTempLeft((prev) => ({ ...prev, operator: v as FilterNumberOperator }))
        }
      />

      <input
        data-ln-input
        type="number"
        style={{ height: 28 }}
        className="text-xs w-full"
        placeholder="Filter value..."
        value={tempLeft.value ?? ""}
        onChange={(e) => {
          const val = Number.parseFloat(e.target.value);
          setTempLeft((prev) => ({
            ...prev,
            value: Number.isNaN(val) ? undefined : val,
          }));
        }}
      />

      {showSecond && (
        <>
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
                    "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-ln-primary-50",
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
                    "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-ln-primary-50",
                  )}
                />
                Or
              </label>
            </div>
          </div>

          <OperatorSelect
            value={selectedRightOption}
            onChange={(v) =>
              setTempRight((prev) => ({
                ...prev,
                operator: v as FilterNumberOperator,
              }))
            }
          />

          <input
            data-ln-input
            type="number"
            style={{ height: 28 }}
            className="text-xs w-full"
            placeholder="Filter value..."
            value={tempRight.value ?? ""}
            onChange={(e) => {
              const val = Number.parseFloat(e.target.value);
              setTempRight((prev) => ({
                ...prev,
                value: Number.isNaN(val) ? undefined : val,
              }));
            }}
          />
        </>
      )}
    </div>
  );
}
