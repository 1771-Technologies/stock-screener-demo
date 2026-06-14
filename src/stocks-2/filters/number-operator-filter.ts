export type FilterNumberOperator =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "greater_than_or_equals"
  | "less_than"
  | "less_than_or_equals";

export interface FilterNumber {
  readonly operator: FilterNumberOperator;
  readonly value: number;
}

export interface NumberColumnFilter {
  readonly left: FilterNumber;
  readonly right: FilterNumber | null;
  readonly operator: "AND" | "OR";
}

export function evaluateNumberOperator(
  operator: FilterNumberOperator,
  rowValue: number,
  filterValue: number
): boolean {
  if (operator === "equals") return rowValue === filterValue;
  if (operator === "not_equals") return rowValue !== filterValue;
  if (operator === "greater_than") return rowValue > filterValue;
  if (operator === "greater_than_or_equals") return rowValue >= filterValue;
  if (operator === "less_than") return rowValue < filterValue;
  if (operator === "less_than_or_equals") return rowValue <= filterValue;
  return false;
}

export function matchesNumberColumnFilter(
  rowValue: number | null | undefined,
  filter: NumberColumnFilter
): boolean {
  if (rowValue == null) return true;

  const leftResult = evaluateNumberOperator(
    filter.left.operator,
    rowValue,
    filter.left.value
  );

  if (!filter.right) return leftResult;

  const rightResult = evaluateNumberOperator(
    filter.right.operator,
    rowValue,
    filter.right.value
  );

  return filter.operator === "OR"
    ? leftResult || rightResult
    : leftResult && rightResult;
}
