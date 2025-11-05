import type {
  FilterCombination,
  FilterModelItem,
  FilterNumber,
} from "@1771technologies/lytenyte-pro/types";

export function unparseNumberFilter(source: FilterModelItem<any> | undefined) {
  if (source?.kind !== "combination") return "";
  return source.filters
    .map((c) => {
      if (c.kind !== "combination") return;

      return c.filters
        .filter((c) => {
          return c.kind === "number";
        })
        .map((c) => {
          const content = [];
          if (c.operator === "equals") content.push("=");
          if (c.operator === "greater_than") content.push(">");
          if (c.operator === "greater_than_or_equals") content.push(">=");
          if (c.operator === "less_than") content.push("<");
          if (c.operator === "less_than_or_equals") content.push("<=");
          if (c.operator == "not_equals") content.push("!=");

          content.push(`${c.value}`);

          return content.join(" ");
        })
        .join(" && ");
    })
    .join(" || ");
}

export function parseNumberFilter(source: string) {
  const ors = source.split("||").map((c) => c.trim());

  const rootFilter: FilterCombination[] = [];
  try {
    for (const or of ors) {
      const ands = or.split("&&").map((c) => c.trim());

      const filters: FilterNumber[] = [];

      for (const and of ands) {
        if (and.startsWith("!=")) {
          const val = Number.parseFloat(and.split("!=").at(-1)!);
          if (Number.isNaN(val)) throw new Error("failed to parse");
          filters.push({
            kind: "number",
            operator: "not_equals",
            value: val,
          });
        } else if (and.startsWith("=")) {
          const val = Number.parseFloat(and.split("=").at(-1)!);
          if (Number.isNaN(val)) throw new Error("failed to parse");
          filters.push({
            kind: "number",
            operator: "equals",
            value: val,
          });
        } else if (and.startsWith("<=")) {
          const val = Number.parseFloat(and.split("<=").at(-1)!);
          if (Number.isNaN(val)) throw new Error("failed to parse");
          filters.push({
            kind: "number",
            operator: "less_than_or_equals",
            value: val,
          });
        } else if (and.startsWith(">=")) {
          const val = Number.parseFloat(and.split(">=").at(-1)!.trim());
          if (Number.isNaN(val)) throw new Error("failed to parse");
          filters.push({
            kind: "number",
            operator: "greater_than_or_equals",
            value: val,
          });
        } else if (and.startsWith(">")) {
          const val = Number.parseFloat(and.split(">").at(-1)!);
          if (Number.isNaN(val)) throw new Error("failed to parse");
          filters.push({
            kind: "number",
            operator: "greater_than",
            value: val,
          });
        } else if (and.startsWith("<")) {
          const val = Number.parseFloat(and.split("<").at(-1)!);
          if (Number.isNaN(val)) throw new Error("failed to parse");
          filters.push({
            kind: "number",
            operator: "less_than",
            value: val,
          });
        }
      }

      const andFilter = {
        kind: "combination",
        filters,
        operator: "AND",
      } satisfies FilterCombination;

      rootFilter.push(andFilter);
    }
  } catch {
    // console.log(e);
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    if (rootFilter.length === 0) return null;

    // eslint-disable-next-line no-unsafe-finally
    return {
      filters: rootFilter,
      kind: "combination",
      operator: "OR",
    } satisfies FilterCombination;
  }
}

export function isIncompatibleNumberFilter(
  filter: FilterModelItem<any> | undefined
) {
  if (filter == null) return false;

  if (filter?.kind !== "combination") return true;

  if (filter.filters.some((f) => f.kind !== "combination")) return true;

  return false;
}
