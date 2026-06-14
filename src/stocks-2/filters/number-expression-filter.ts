type NumberOperator =
  | "not_equals"
  | "greater_than_or_equals"
  | "less_than_or_equals"
  | "greater_than"
  | "less_than"
  | "equals";

interface NumberCondition {
  operator: NumberOperator;
  value: number;
}

function parseCondition(token: string): NumberCondition | null {
  const t = token.trim();
  let operator: NumberOperator;
  let rest: string;

  // Multi-char operators must be checked before single-char
  if (t.startsWith("!=")) {
    operator = "not_equals";
    rest = t.slice(2);
  } else if (t.startsWith(">=")) {
    operator = "greater_than_or_equals";
    rest = t.slice(2);
  } else if (t.startsWith("<=")) {
    operator = "less_than_or_equals";
    rest = t.slice(2);
  } else if (t.startsWith(">")) {
    operator = "greater_than";
    rest = t.slice(1);
  } else if (t.startsWith("<")) {
    operator = "less_than";
    rest = t.slice(1);
  } else if (t.startsWith("=")) {
    operator = "equals";
    rest = t.slice(1);
  } else {
    return null;
  }

  const val = Number.parseFloat(rest.trim());
  if (Number.isNaN(val)) return null;

  return { operator, value: val };
}

function evaluateCondition(condition: NumberCondition, value: number): boolean {
  switch (condition.operator) {
    case "equals":
      return value === condition.value;
    case "not_equals":
      return value !== condition.value;
    case "greater_than":
      return value > condition.value;
    case "greater_than_or_equals":
      return value >= condition.value;
    case "less_than":
      return value < condition.value;
    case "less_than_or_equals":
      return value <= condition.value;
  }
}

export function matchesNumberExpression(
  value: number | null | undefined,
  expr: string
): boolean {
  if (value == null) return true;

  try {
    const orGroups = expr
      .split("||")
      .map((s) => s.trim())
      .filter(Boolean);

    return orGroups.some((group) => {
      const conditions = group
        .split("&&")
        .map((s) => s.trim())
        .filter(Boolean);

      return conditions.every((token) => {
        const condition = parseCondition(token);
        if (!condition) return true;
        return evaluateCondition(condition, value);
      });
    });
  } catch {
    return true;
  }
}
