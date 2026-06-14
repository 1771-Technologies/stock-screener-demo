export type FilterStringOperator =
  | "equals"
  | "not_equals"
  | "begins_with"
  | "not_begins_with"
  | "ends_with"
  | "not_ends_with"
  | "contains"
  | "not_contains";

export interface FilterString {
  readonly operator: FilterStringOperator;
  readonly value: string;
}

export interface StringColumnFilter {
  readonly left: FilterString;
  readonly right: FilterString | null;
  readonly operator: "AND" | "OR";
}

export function evaluateStringOperator(
  operator: FilterStringOperator,
  compare: string,
  value: string,
): boolean {
  if (operator === "equals") return compare === value;
  if (operator === "not_equals") return compare !== value;
  if (operator === "contains") return compare.includes(value);
  if (operator === "not_contains") return !compare.includes(value);
  if (operator === "begins_with") return compare.startsWith(value);
  if (operator === "not_begins_with") return !compare.startsWith(value);
  if (operator === "ends_with") return compare.endsWith(value);
  if (operator === "not_ends_with") return !compare.endsWith(value);
  return false;
}

export function matchesStringColumnFilter(
  rowValue: string,
  filter: StringColumnFilter,
): boolean {
  const compare = rowValue.toLowerCase();
  const leftResult = evaluateStringOperator(
    filter.left.operator,
    compare,
    filter.left.value.toLowerCase(),
  );

  if (!filter.right) return leftResult;

  const rightResult = evaluateStringOperator(
    filter.right.operator,
    compare,
    filter.right.value.toLowerCase(),
  );

  return filter.operator === "OR"
    ? leftResult || rightResult
    : leftResult && rightResult;
}
